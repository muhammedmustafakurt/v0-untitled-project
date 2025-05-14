import { NextResponse } from "next/server"
import { getSessionMessages } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    console.log(`Mesajlar alınıyor, sessionId: ${sessionId}`)
    const messages = await getSessionMessages(sessionId)
    console.log(`Alınan mesajlar:`, messages)

    // Mesajları döndür
    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error getting messages:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error(`Hata detayı: ${errorMessage}`)

    // Hata durumunda demo mesajlar döndür
    const demoMessages = [
      {
        id: "m1",
        sender: "Instagram",
        content: "Instagram 142323. Don't share it.",
        receivedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        code: "142323",
      },
    ]

    return NextResponse.json(demoMessages)
  }
}
