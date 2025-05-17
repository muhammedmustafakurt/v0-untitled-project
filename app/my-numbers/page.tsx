import { cookies } from "next/headers"
import { getActiveSessions } from "@/lib/api"

// Sayfayı dinamik olarak işaretle
export const dynamic = "force-dynamic"

export default async function MyNumbersPage() {
  let sessions = []
  let error = null

  try {
    // Get session IDs from cookies
    const sessionsCookie = cookies().get("sessions")
    let sessionIds: string[] = []

    if (sessionsCookie?.value) {
      try {
        sessionIds = JSON.parse(sessionsCookie.value)
      } catch (e) {
        console.error("Error parsing sessions cookie:", e)
      }
    }

    if (sessionIds.length > 0) {
      // Get the session details from the API
      sessions = await getActiveSessions(sessionIds)
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

      {sessions.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <p className="text-amber-800">Henüz kiralanmış numaranız yok. Başlamak için bir numara kiralayın.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                  {session.country.isoCode}
                </div>
                <div>
                  <div className="font-medium">{session.phoneNumber}</div>
                  <div className="text-sm text-gray-500">{session.country.name}</div>
                </div>
              </div>

              <a
                href={`/messages/${session.id}`}
                className="block mt-3 text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded"
              >
                Mesajları Görüntüle
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
