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
    try {
      session = await getSessionDetails(params.sessionId)
      console.log("Oturum detayları alındı:", session)
    } catch (sessionError) {
      console.error("Error fetching session details:", sessionError)
      error = sessionError instanceof Error ? sessionError.message : "Unknown error occurred"
    }

    // Sonra mesajları al - artık mesajlar oturum detaylarında geliyor
    if (session) {
      try {
        messages = await getSessionMessages(params.sessionId)
        console.log("Mesajlar alındı:", messages)
      } catch (messagesError) {
        console.error("Error fetching messages:", messagesError)
        if (!error) {
          error = messagesError instanceof Error ? messagesError.message : "Unknown error occurred"
        }
      }
    }
  } catch (err) {
    console.error("Error in SessionMessagesPage:", err)
    error = err instanceof Error ? err.message : "Unknown error occurred"
  }

  // Eğer session alınamadıysa, demo session oluştur
  if (!session) {
    session = {
      id: params.sessionId,
      phoneNumber: "+90 555 123 4567",
      expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes
    }
  }

  // Eğer mesajlar alınamadıysa ve hata varsa, demo mesajlar göster
  if (messages.length === 0 && error) {
    messages = [
      {
        id: "m1",
        sender: "Instagram",
        content: "Instagram 142323. Don't share it.",
        receivedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        code: "142323",
      },
    ]
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
          <p className="font-medium">Not: Demo veriler gösteriliyor</p>
          <p className="text-sm">
            API'ye bağlanırken bir sorun oluştu, bu nedenle demo veriler gösteriliyor. Bu demo sürümünde, doğrulama
            kodunu görebilirsiniz.
          </p>
          <p className="text-xs mt-1">Hata: {error}</p>
        </div>
      )}

      <MessageList
        messages={messages}
        sessionId={params.sessionId}
        expiresAt={session?.expiresAt || new Date(Date.now() + 1000 * 60 * 30).toISOString()}
        isDemo={!!error}
      />
    </div>
  )
}
