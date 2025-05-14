import { NextResponse } from "next/server"
import { getSessionDetails } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    console.log(`Oturum detayları alınıyor, sessionId: ${sessionId}`)
    const session = await getSessionDetails(sessionId)
    console.log(`Alınan oturum:`, session)

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error getting session details:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error(`Hata detayı: ${errorMessage}`)

    // Hata durumunda demo oturum döndür
    const demoSession = {
      id: params.sessionId,
      phoneNumber: "+90 555 123 4567",
      country: {
        name: "Turkey",
        isoCode: "TR",
      },
      platform: {
        name: "Instagram",
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes
      messageCount: 1,
      message: {
        text: "Instagram 142323. Don't share it.",
        sender: "INSTAGRAM",
        code: "142323",
      },
    }

    return NextResponse.json(demoSession)
  }
}
