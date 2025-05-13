import { NextResponse } from "next/server"
import { getSessionMessages } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const messages = await getSessionMessages(sessionId)

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error getting messages:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: `Failed to get messages: ${errorMessage}` }, { status: 500 })
  }
}
