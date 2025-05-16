"use client"

// Client-side API functions that call server actions
export async function autoRentNumber() {
  try {
    const response = await fetch("/api/auto-rent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(errorData.error || "Failed to rent number")
    }

    return await response.json()
  } catch (error) {
    console.error("Error in autoRentNumber client function:", error)
    throw error
  }
}

export async function getMessages(sessionId: string) {
  try {
    console.log(`Client: Mesajlar alınıyor, sessionId: ${sessionId}`)

    const response = await fetch(`/api/messages/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Ensure we're not caching the response
      cache: "no-store",
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }))
      throw new Error(error.message || "Failed to get messages")
    }

    return await response.json()
  } catch (error) {
    console.error("Error in getMessages client function:", error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

export async function getSessionDetails(sessionId: string) {
  try {
    const response = await fetch(`/api/session/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }))
      throw new Error(error.message || "Failed to get session details")
    }

    return await response.json()
  } catch (error) {
    console.error("Error in getSessionDetails client function:", error)
    // Return null instead of throwing to prevent UI crashes
    return null
  }
}
