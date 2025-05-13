import { cookies } from "next/headers"
import { getActiveSessions } from "@/lib/api"
import { ActiveNumbersList } from "@/components/active-numbers-list"
import { mockSessions } from "@/components/mock-data"

export default async function MyNumbersPage() {
  const cookieStore = cookies()
  const sessionsCookie = cookieStore.get("sessions")

  let sessions = []
  let error = null
  let useMockData = false

  try {
    if (sessionsCookie?.value) {
      const sessionIds = JSON.parse(sessionsCookie.value)
      if (Array.isArray(sessionIds) && sessionIds.length > 0) {
        sessions = await getActiveSessions(sessionIds)
      }
    }

    // If no sessions but we have cookies, something went wrong with the API
    if (sessions.length === 0 && sessionsCookie?.value) {
      useMockData = true
      sessions = mockSessions
    }
  } catch (err) {
    console.error("Error fetching sessions:", err)
    error = err instanceof Error ? err.message : "Unknown error occurred"
    useMockData = true
    sessions = mockSessions
  }

  // For demo purposes, if no sessions at all, show mock data
  if (sessions.length === 0 && !sessionsCookie?.value) {
    useMockData = true
    sessions = [] // Keep empty for new users
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Rented Numbers</h1>

      {useMockData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Note: Demo Mode</p>
          <p className="text-sm">You're viewing the demo interface. Rent a number to see your active sessions here.</p>
        </div>
      )}

      <ActiveNumbersList sessions={sessions} />
    </div>
  )
}
