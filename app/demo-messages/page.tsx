import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, PhoneIcon } from "lucide-react"
import { MessageList } from "@/components/message-list"

export default function DemoMessagesPage() {
  // Demo oturum ve mesaj verileri
  const sessionId = "demo-session"
  const session = {
    id: sessionId,
    phoneNumber: "+90 555 123 4567",
    expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes
  }

  const messages = [
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

      <h1 className="text-3xl font-bold mb-6">Demo Mesajlar</h1>

      <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <PhoneIcon className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Demo Telefon Numarası:</p>
            <p className="font-medium">{session.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
        <p className="font-medium">Demo Sayfası</p>
        <p className="text-sm">
          Bu sayfa, Yemeksepeti doğrulama mesajlarının nasıl görüneceğini göstermek için oluşturulmuştur. Gerçek bir
          telefon numarası veya mesaj içermez.
        </p>
      </div>

      <p className="text-gray-600 mb-8">Yemeksepeti'nden gelen örnek mesajları aşağıda görebilirsiniz.</p>

      <MessageList messages={messages} sessionId={sessionId} expiresAt={session.expiresAt} isDemo={true} />
    </div>
  )
}
