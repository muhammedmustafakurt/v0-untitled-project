import { cookies } from "next/headers"
import { getActiveSessions } from "@/lib/api"
import { ActiveNumbersList } from "@/components/active-numbers-list"
import { jwtVerify } from "jose"
import { getUserSessions } from "@/lib/auth"

// JWT secret'ı buffer'a çevirme
const textEncoder = new TextEncoder()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const secretKey = textEncoder.encode(JWT_SECRET)

export default async function MyNumbersPage() {
  let sessions = []
  let error = null
  let userId = null

  try {
    // Get the user ID from the auth token
    const token = cookies().get("auth_token")?.value

    if (token) {
      try {
        const { payload } = await jwtVerify(token, secretKey)
        userId = payload.id as string
      } catch (e) {
        console.error("Invalid token:", e)
      }
    }

    if (userId) {
      // Get the user's sessions from the database
      const sessionIds = await getUserSessions(userId)

      if (sessionIds.length > 0) {
        // Get the session details from the API
        sessions = await getActiveSessions(sessionIds)
      }
    }
  } catch (err) {
    console.error("Error fetching sessions:", err)
    error = err instanceof Error ? err.message : "Unknown error occurred"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Numaralarım</h1>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Hata</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <ActiveNumbersList sessions={sessions} />
    </div>
  )
}
