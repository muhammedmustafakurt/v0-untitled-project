import { getSessionMessages, getSessionDetails } from "@/lib/api"
import { MessageList } from "@/components/message-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, PhoneIcon } from "lucide-react"

export default async function SessionMessagesPage({ params }: { params: { sessionId: string } }) {
  let messages = []
  let session = null
  let error = null

  try {
    // Önce oturum detaylarını al
    session = await getSessionDetails(params.sessionId)

    // Sonra mesajları al
    messages = await getSessionMessages(params.sessionId)
  } catch (err) {
    console.error("Error in SessionMessagesPage:", err)
    error = err instanceof Error ? err.message : "Unknown error occurred"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeftIcon className="h-4 w-4" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Mesajlarım</h1>

      {session && (
        <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <PhoneIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefon Numarası:</p>
              <p className="font-medium">{session.phoneNumber}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-gray-600 mb-8">Bu numaraya gelen tüm mesajları görüntüleyin.</p>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Hata: {error}</p>
          <p className="text-sm">Mesajlar alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      )}

      <MessageList
        messages={messages}
        sessionId={params.sessionId}
        expiresAt={session?.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString()}
      />
    </div>
  )
}
