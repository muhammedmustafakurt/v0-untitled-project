import { NextResponse } from "next/server"
import { getSessionDetails } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const session = await getSessionDetails(sessionId)

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error getting session details:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: `Failed to get session details: ${errorMessage}` }, { status: 500 })
  }
}
