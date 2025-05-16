import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { addSessionToUser, getUserSessions } from "@/lib/auth"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Add a session to the user's account
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId } = body
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: string }

    // Add the session to the user
    await addSessionToUser(decoded.id, sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding session:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Get the user's sessions
export async function GET() {
  try {
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: string }

    // Get the user's sessions
    const sessions = await getUserSessions(decoded.id)

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Error getting sessions:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
