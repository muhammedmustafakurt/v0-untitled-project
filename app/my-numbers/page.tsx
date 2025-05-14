import { cookies } from "next/headers"
import { getActiveSessions } from "@/lib/api"
import { ActiveNumbersList } from "@/components/active-numbers-list"
import { verify } from "jsonwebtoken"
import { getUserSessions } from "@/lib/auth"
import { Header } from "@/components/header"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export default async function MyNumbersPage() {
  let sessions = []
  let error = null
  let userId = null

  try {
    // Get the user ID from the auth token
    const token = cookies().get("auth_token")?.value

    if (token) {
      try {
        const decoded = verify(token, JWT_SECRET) as { id: string }
        userId = decoded.id
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
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Numaralarım</h1>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Hata</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <ActiveNumbersList sessions={sessions} />
      </div>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2025 Yemeksepeti Doğrulama. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
