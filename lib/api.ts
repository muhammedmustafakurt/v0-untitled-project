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
      cache: "no-store",
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
    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Get a default country ID (Turkey for YemekSepeti)
export async function getDefaultCountry() {
  try {
    // Direkt olarak Türkiye ID'sini kullanıyoruz
    return {
      id: TURKEY_COUNTRY_ID,
      name: "Turkey",
      isoCode: "TR",
      phonePrefix: "90",
    }
  } catch (error) {
    console.error("Error getting default country:", error)
    // Return a mock country for fallback
    return { id: TURKEY_COUNTRY_ID, name: "Turkey", isoCode: "TR", phonePrefix: "90" }
  }
}

// Auto-rent a number specifically for Yemeksepeti
export async function autoRentPhoneNumber() {
  try {
    // Direkt olarak Yemeksepeti için session oluştur
    const response = await apiRequest("/sms/session/create", "POST", {
      serviceId: YEMEKSEPETI_SERVICE_ID, // Yemeksepeti service ID
    })

    if (!response.result?.session) {
      console.warn("No session found in response:", response)
      throw new Error("Failed to create session")
    }

    const session = response.result.session

    return {
      ...session,
      country: {
        name: "Turkey",
        isoCode: "TR",
        phonePrefix: "90",
      },
      platform: {
        name: "Yemeksepeti",
      },
    }
  } catch (error) {
    console.error("Error auto-renting phone number:", error)

    // Return mock data for fallback/demo
    return {
      id: `session-${Date.now()}`,
      phoneNumber: "+90 555 123 4567",
      country: {
        name: "Turkey",
        isoCode: "TR",
      },
      platform: {
        name: "Yemeksepeti",
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes (1800 seconds) as per JSON
      messageCount: 0,
    }
  }
}

// Get messages for a session - UPDATED to use the correct API endpoint
export async function getSessionMessages(sessionId: string) {
  try {
    // Doğru API endpoint'i kullanarak mesajları al
    const response = await apiRequest("/sms/session", "POST", {
      sessionId: sessionId,
    })

    if (!response.result?.messages) {
      console.warn("No messages found in response:", response)
      return []
    }

    return response.result.messages || []
  } catch (error) {
    console.error("Error fetching session messages:", error)

    // Return mock data for fallback/demo - Yemeksepeti themed
    return [
      {
        id: "m1",
        sender: "Yemeksepeti",
        content: "Yemeksepeti'ye hoş geldiniz! Doğrulama kodunuz: 123456",
        receivedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      },
      {
        id: "m2",
        sender: "Yemeksepeti",
        content: "Siparişiniz alındı! Takip kodu: XYZ123. Siparişinizi uygulamamızdan takip edebilirsiniz.",
        receivedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      },
    ]
  }
}

// Get session details
export async function getSessionDetails(sessionId: string) {
  try {
    const response = await apiRequest("/sms/session", "POST", {
      id: sessionId,
    })

    if (!response.result?.session) {
      console.warn("No session found in response:", response)
      throw new Error("Session not found")
    }

    return response.result.session
  } catch (error) {
    console.error("Error fetching session details:", error)
    throw error
  }
}

export async function getCountries() {
  try {
    const response = await apiRequest("/country/list/get", "POST", {})

    if (!response.result?.countries) {
      console.warn("No countries found in response:", response)
      return []
    }

    return response.result.countries || []
  } catch (error) {
    console.error("Error fetching countries:", error)
    throw error
  }
}

export async function getPhoneNumbers(countryId: string) {
  try {
    const response = await apiRequest("/number/list/get", "POST", {
      serviceId: YEMEKSEPETI_SERVICE_ID, // Yemeksepeti service ID
    })

    if (!response.result?.numbers) {
      console.warn("No phone numbers found in response:", response)
      return []
    }

    return response.result.numbers || []
  } catch (error) {
    console.error("Error fetching phone numbers:", error)
    throw error
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
        // Skip this session if there's an error
      }
    }
    return sessions
  } catch (error) {
    console.error("Error fetching active sessions:", error)
    throw error
  }
}

// Get service information for Yemeksepeti
export async function getYemeksepetiServiceInfo() {
  try {
    // This function could be used to get up-to-date information about the service
    // For now, returning hardcoded data based on the provided JSON
    return {
      id: YEMEKSEPETI_SERVICE_ID,
      country: {
        id: TURKEY_COUNTRY_ID,
        name: "Turkey",
        isoName: "tr",
        iconPath: "/assets/images/flag/tr.svg",
        phonePrefix: "90",
      },
      platform: {
        id: YEMEKSEPETI_SERVICE_ID,
        name: "Yemeksepeti",
        iconPath: "/assets/images/platform/yemeksepeti.webp",
      },
      amount: {
        usageAmount: "0.30",
        reuseAmount: "0.00",
        usageDiscountedAmount: "0.30",
        reuseDiscountedAmount: "0.00",
      },
      maxReuse: 10,
      quantity: 1000,
      usageTimeout: 1800, // 30 minutes in seconds
      reuseTimeout: 1800,
      status: "enabled",
    }
  } catch (error) {
    console.error("Error getting Yemeksepeti service info:", error)
    throw error
  }
}

// Helper functions for service operations
export async function getServiceForCountry() {
  // This function is no longer needed since we're directly using Yemeksepeti's ID
  // But we're keeping it for potential compatibility with other code
  return {
    id: YEMEKSEPETI_SERVICE_ID.toString(),
    name: "Yemeksepeti",
    price: 0.3,
    currency: "USD",
  }
}

// Create a new SMS session (rent a number)
export async function createSmsSession() {
  try {
    const response = await apiRequest("/sms/session/create", "POST", {
      serviceId: YEMEKSEPETI_SERVICE_ID,
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
