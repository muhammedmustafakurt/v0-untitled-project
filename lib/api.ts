"use server"

const API_BASE_URL = "https://api.verifynow.net"
const API_SECRET = process.env.API_SECRET

// Yemeksepeti için sabit değerler
const YEMEKSEPETI_SERVICE_ID = 21
const TURKEY_COUNTRY_ID = 1

// Helper function to make authenticated API requests
async function apiRequest(endpoint: string, method = "POST", body: any = {}) {
  try {
    const headers = {
      Authorization: `Bearer ${API_SECRET}`,
      "Content-Type": "application/json",
    }

    const options: RequestInit = {
      method,
      headers,
      body: JSON.stringify(body),
      cache: "no-store", // Her zaman yeni veri al
    }

    console.log(`Making ${method} request to: ${API_BASE_URL}${endpoint}`)
    console.log(`Request body: ${JSON.stringify(body)}`)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

    // Log response status for debugging
    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error: ${errorText}`)
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log(`API Response data:`, data)
    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Auto-rent a number specifically for Yemeksepeti
export async function autoRentPhoneNumber() {
  try {
    // Direkt olarak Yemeksepeti için session oluştur
    const response = await apiRequest("/sms/session/create", "POST", {
      serviceId: YEMEKSEPETI_SERVICE_ID, // Yemeksepeti service ID
    })

    console.log("Auto rent response:", response)

    if (!response.result?.session) {
      console.warn("No session found in response:", response)
      throw new Error("Failed to create session")
    }

    const session = response.result.session

    return {
      id: session.id,
      phoneNumber: session.phoneNumber,
      country: {
        name: "Turkey",
        isoCode: "TR",
        phonePrefix: "90",
      },
      platform: {
        name: "Yemeksepeti",
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes (1800 seconds) as per JSON
      messageCount: 0,
    }
  } catch (error) {
    console.error("Error auto-renting phone number:", error)
    throw error
  }
}

// Get session details
export async function getSessionDetails(sessionId: string) {
  try {
    // Doğru API endpoint'i ve parametreleri kullanarak oturum detaylarını al
    const response = await apiRequest("/sms/session", "POST", {
      sessionId: Number.parseInt(sessionId, 10),
    })

    console.log("Oturum detayları yanıtı:", response)

    if (!response.result?.session) {
      console.warn("No session found in response:", response)
      throw new Error("Session not found")
    }

    const session = response.result.session

    // API yanıtını uygulamamızın beklediği formata dönüştür
    return {
      id: session.id.toString(),
      phoneNumber: formatPhoneNumber(session.phoneNumber),
      country: {
        name: session.country?.name || "Turkey",
        isoCode: session.country?.isoName?.toUpperCase() || "TR",
      },
      platform: {
        name: session.service?.platform?.name || "Unknown",
      },
      expiresAt: new Date(session.expireAt).toISOString(),
      messageCount: session.message ? 1 : 0,
      status: session.status,
      message: session.message,
    }
  } catch (error) {
    console.error("Error fetching session details:", error)
    throw error
  }
}

// Get messages for a session
export async function getSessionMessages(sessionId: string) {
  try {
    // Oturum detaylarını al
    const sessionResponse = await getSessionDetails(sessionId)

    // Eğer oturumda mesaj varsa, onu döndür
    if (sessionResponse.message) {
      return [
        {
          id: "1",
          sender: sessionResponse.message.sender,
          content: sessionResponse.message.text,
          receivedAt: new Date().toISOString(),
          code: sessionResponse.message.code,
        },
      ]
    }

    // Mesaj yoksa boş dizi döndür
    return []
  } catch (error) {
    console.error("Oturuma ait SMS mesajları alınırken hata oluştu:", error)
    throw error
  }
}

// Helper function to format phone number
function formatPhoneNumber(number: string) {
  // If number starts with country code, format it nicely
  if (number && (number.startsWith("90") || number.startsWith("+90"))) {
    const cleaned = number.replace(/\D/g, "").replace(/^90/, "")
    return `+90 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`
  }
  return number
}

// Diğer fonksiyonlar aynı kalabilir...
export async function getDefaultCountry() {
  return { id: TURKEY_COUNTRY_ID, name: "Turkey", isoCode: "TR", phonePrefix: "90" }
}

export async function getCountries() {
  try {
    const response = await apiRequest("/country/list", "POST", {})
    return response.result?.countries || []
  } catch (error) {
    console.error("Error fetching countries:", error)
    return []
  }
}

export async function getPhoneNumbers(countryId: string) {
  try {
    const response = await apiRequest("/service/list", "POST", {
      countryId: Number.parseInt(countryId, 10),
    })
    return response.result?.services || []
  } catch (error) {
    console.error("Error fetching phone numbers:", error)
    return []
  }
}

export async function getActiveSessions(sessionIds: string[]) {
  try {
    const sessions = []
    for (const sessionId of sessionIds) {
      try {
        const sessionDetails = await getSessionDetails(sessionId)
        sessions.push(sessionDetails)
      } catch (error) {
        console.error(`Error fetching session ${sessionId}:`, error)
      }
    }
    return sessions
  } catch (error) {
    console.error("Error fetching active sessions:", error)
    return []
  }
}

export async function getYemeksepetiServiceInfo() {
  return {
    id: YEMEKSEPETI_SERVICE_ID,
    country: {
      id: TURKEY_COUNTRY_ID,
      name: "Turkey",
      isoName: "tr",
      phonePrefix: "90",
    },
    platform: {
      id: YEMEKSEPETI_SERVICE_ID,
      name: "Yemeksepeti",
    },
    amount: {
      usageAmount: "0.30",
      reuseAmount: "0.00",
      usageDiscountedAmount: "0.30",
      reuseDiscountedAmount: "0.00",
    },
    maxReuse: 10,
    quantity: 1000,
    usageTimeout: 1800,
    reuseTimeout: 1800,
    status: "enabled",
  }
}

export async function getServiceForCountry() {
  return {
    id: YEMEKSEPETI_SERVICE_ID.toString(),
    name: "Yemeksepeti",
    price: 0.3,
    currency: "USD",
  }
}

// Create a new SMS session (rent a number)
export async function createSmsSession(serviceId: number) {
  try {
    const response = await apiRequest("/sms/session/create", "POST", {
      serviceId,
    })

    if (!response.result?.session) {
      console.warn("No session found in response:", response)
      throw new Error("Failed to create session")
    }

    return response.result.session
  } catch (error) {
    console.error("Error creating SMS session:", error)
    throw error
  }
}
