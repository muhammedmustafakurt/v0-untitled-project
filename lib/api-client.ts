"use client"

// Client-side API functions that call server actions
export async function autoRentNumber() {
  const response = await fetch("/api/auto-rent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }))
    throw new Error(error.message || "Failed to rent number")
  }

  return response.json()
}

export async function getMessages(sessionId: string) {
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

  return response.json()
}

export async function getSessionDetails(sessionId: string) {
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

  return response.json()
}
