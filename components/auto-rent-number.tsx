"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PhoneIcon, Loader2Icon, CheckCircleIcon, RefreshCwIcon, CopyIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { autoRentNumber } from "@/lib/api-client"

export function AutoRentNumber() {
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleRentNumber = async () => {
    setLoading(true)
    try {
      const result = await autoRentNumber()

      setPhoneNumber(result.phoneNumber)
      setSessionId(result.id)

      // Store session in localStorage and cookies
      const existingSessions = JSON.parse(localStorage.getItem("sessions") || "[]")
      localStorage.setItem("sessions", JSON.stringify([...existingSessions, result.id]))
      document.cookie = `sessions=${JSON.stringify([...existingSessions, result.id])}; path=/; max-age=86400`

      toast({
        title: "Numara başarıyla kiralandı!",
        description: "Bu numarayı Yemeksepeti'de kullanabilir ve SMS mesajlarını burada görebilirsiniz.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error renting number:", error)
      toast({
        title: "Numara kiralanamadı",
        description: error instanceof Error ? error.message : "Lütfen daha sonra tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewMessages = () => {
    if (sessionId) {
      router.push(`/messages/${sessionId}`)
    }
  }

  const handleRentAnother = () => {
    setPhoneNumber(null)
    setSessionId(null)
    handleRentNumber()
  }

  const handleCopyNumber = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber)
      setCopied(true)
      toast({
        title: "Kopyalandı!",
        description: "Telefon numarası panoya kopyalandı.",
        variant: "default",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="shadow-md border-red-100">
      <CardContent className="p-6">
        {!phoneNumber ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Telefon Numaranızı Alın</h3>
            <p className="text-gray-600 mb-6">
              Yemeksepeti için SMS mesajları almak üzere hemen bir telefon numarası kiralamak için aşağıdaki butona
              tıklayın.
            </p>
            <Button
              onClick={handleRentNumber}
              disabled={loading}
              size="lg"
              className="bg-red-600 hover:bg-red-700 w-full"
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Numaranız alınıyor...
                </>
              ) : (
                <>
                  <PhoneIcon className="mr-2 h-4 w-4" />
                  Telefon Numarası Al
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">Kullanım ücreti: 0.30 USD</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold">Numaranız Hazır!</h3>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-6 relative">
              <p className="text-sm text-red-700 mb-1">Geçici telefon numaranız:</p>
              <p className="text-xl font-mono font-semibold">{phoneNumber}</p>
              <button
                onClick={handleCopyNumber}
                className="absolute right-2 top-2 p-1 rounded-md hover:bg-red-100 transition-colors"
                aria-label="Numarayı kopyala"
              >
                {copied ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <CopyIcon className="h-5 w-5 text-red-600" />
                )}
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6 text-left">
              <p className="text-sm text-yellow-800">
                <strong>Nasıl kullanılır:</strong> Bu numarayı Yemeksepeti kayıt formunda kullanın. Doğrulama kodunu
                görmek için "Mesajları Görüntüle" butonuna tıklayın.
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                <strong>Not:</strong> Bu numara 30 dakika süreyle geçerlidir.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleViewMessages} className="bg-red-600 hover:bg-red-700">
                Mesajları Görüntüle
              </Button>

              <Button onClick={handleRentAnother} variant="outline" className="flex items-center">
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                Başka Numara Al
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
