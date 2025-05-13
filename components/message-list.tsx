"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCwIcon, MessageSquareIcon, AlertCircleIcon, CopyIcon, CheckCircleIcon, ClockIcon } from "lucide-react"
import { formatDate, formatTimeLeft } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getMessages } from "@/lib/api-client"

interface Message {
  id: string
  sender: string
  content: string
  receivedAt: string
}

interface MessageListProps {
  messages: Message[]
  sessionId: string
  expiresAt: string
}

export function MessageList({ messages: initialMessages, sessionId, expiresAt }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [refreshing, setRefreshing] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>(formatTimeLeft(expiresAt))
  const [isExpired, setIsExpired] = useState<boolean>(new Date(expiresAt).getTime() <= Date.now())
  const router = useRouter()
  const { toast } = useToast()

  // Set up auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isExpired) {
        handleRefresh(false)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [sessionId, isExpired])

  // Set up countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const expTime = new Date(expiresAt).getTime()
      const now = Date.now()

      if (expTime <= now) {
        setIsExpired(true)
        setTimeLeft("Süresi doldu")
        clearInterval(timer)

        if (!isExpired) {
          toast({
            title: "Süre doldu",
            description: "Bu numara artık geçerli değil. Lütfen yeni bir numara kiralayın.",
            variant: "destructive",
          })
        }
      } else {
        setTimeLeft(formatTimeLeft(expiresAt))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])

  const handleRefresh = async (showToast = true) => {
    setRefreshing(true)
    try {
      const updatedMessages = await getMessages(sessionId)
      setMessages(updatedMessages)

      if (showToast) {
        toast({
          title: "Yenilendi",
          description: "Mesajlarınız yenilendi.",
        })
      }
    } catch (error) {
      console.error("Error refreshing messages:", error)
      if (showToast) {
        toast({
          title: "Yenileme başarısız",
          description: "Mesajlar yenilenemedi. Lütfen tekrar deneyin.",
          variant: "destructive",
        })
      }
    } finally {
      setRefreshing(false)
    }
  }

  const handleCopyContent = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast({
      title: "Kopyalandı!",
      description: "Mesaj içeriği panoya kopyalandı.",
      variant: "default",
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Extract verification codes from message content
  const extractVerificationCode = (content: string) => {
    // Common patterns for verification codes
    const patterns = [
      /\b([0-9]{6})\b/, // 6-digit code
      /\b([0-9]{4})\b/, // 4-digit code
      /\bkod\s*:?\s*([0-9A-Za-z]{4,8})/i, // "kod: XXXX"
      /\bcode\s*:?\s*([0-9A-Za-z]{4,8})/i, // "code: XXXX"
      /\bverification\s*code\s*:?\s*([0-9A-Za-z]{4,8})/i, // "verification code: XXXX"
      /\bdoğrulama\s*kodu\s*:?\s*([0-9A-Za-z]{4,8})/i, // "doğrulama kodu: XXXX" (Turkish)
      /\bonay\s*kodu\s*:?\s*([0-9A-Za-z]{4,8})/i, // "onay kodu: XXXX" (Turkish)
    ]

    for (const pattern of patterns) {
      const match = content.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span>Kalan süre: {timeLeft}</span>
        </div>
        <Button
          variant="outline"
          onClick={() => handleRefresh()}
          disabled={refreshing || isExpired}
          className="flex items-center gap-2"
        >
          <RefreshCwIcon className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Şimdi Yenile
        </Button>
      </div>

      {isExpired && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Bu numaranın süresi doldu</p>
          <p className="text-sm">
            Bu telefon numarasının kullanım süresi doldu. Yeni bir numara kiralamak için ana sayfaya dönün.
          </p>
        </div>
      )}

      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircleIcon className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz Mesaj Yok</h3>
            <p className="text-gray-600 mb-4">
              Bu numaraya henüz mesaj almadınız. Mesajlar geldiğinde otomatik olarak burada görünecektir.
            </p>
            <p className="text-sm text-gray-500">Her 15 saniyede bir yeni mesajlar için otomatik kontrol ediyoruz.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const verificationCode = extractVerificationCode(message.content)

            return (
              <Card key={message.id} className={verificationCode ? "border-green-200" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquareIcon className="h-5 w-5 text-red-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">{message.sender}</div>
                        <div className="text-sm text-gray-500">{formatDate(message.receivedAt)}</div>
                      </div>
                      <p className="text-gray-700 relative pr-8">
                        {message.content}
                        <button
                          onClick={() => handleCopyContent(message.id, message.content)}
                          className="absolute right-0 top-0 p-1 rounded-md hover:bg-gray-100 transition-colors"
                          aria-label="Mesajı kopyala"
                        >
                          {copiedId === message.id ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <CopyIcon className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </p>

                      {verificationCode && (
                        <div className="mt-2 bg-green-50 p-2 rounded border border-green-200 flex justify-between items-center">
                          <div>
                            <span className="text-xs text-green-700 font-medium">Doğrulama Kodu:</span>
                            <span className="ml-2 font-mono font-bold text-green-800">{verificationCode}</span>
                          </div>
                          <button
                            onClick={() => handleCopyContent(`code-${message.id}`, verificationCode)}
                            className="p-1 rounded-md hover:bg-green-100 transition-colors"
                            aria-label="Kodu kopyala"
                          >
                            {copiedId === `code-${message.id}` ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            ) : (
                              <CopyIcon className="h-4 w-4 text-green-700" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
