import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PhoneIcon } from "lucide-react"

export default function MessagesPage() {
  const cookieStore = cookies()
  const sessionsCookie = cookieStore.get("sessions")

  let sessionIds: string[] = []

  try {
    if (sessionsCookie?.value) {
      sessionIds = JSON.parse(sessionsCookie.value)
    }
  } catch (error) {
    console.error("Error parsing sessions cookie:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mesajlarım</h1>

      {sessionIds.length === 0 ? (
        <div className="text-center py-12">
          <PhoneIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Henüz Telefon Numarası Yok</h2>
          <p className="text-gray-600 mb-6">
            Henüz bir telefon numarası kiralamadınız. Bir numara kiralayarak başlayın.
          </p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">Telefon Numarası Kirala</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessionIds.map((sessionId) => (
            <Link href={`/messages/${sessionId}`} key={sessionId}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Oturum: {sessionId}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Mesajları Görüntüle
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
