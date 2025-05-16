import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { isUserAdmin, getAllUsers } from "@/lib/auth"
import { getActiveSessions } from "@/lib/api"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET() {
  try {
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: string }

    // Check if user is admin
    const isAdmin = await isUserAdmin(decoded.id)
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 })
    }

    // Get all users
    const users = await getAllUsers()

    // Get all sessions from all users
    let allSessions = []

    for (const user of users) {
      if (user.sessions && user.sessions.length > 0) {
        try {
          const userSessions = await getActiveSessions(user.sessions)

          // Add user info to each session
          const sessionsWithUserInfo = userSessions.map((session) => ({
            ...session,
            userId: user._id,
            userEmail: user.email,
            userName: user.name,
          }))

          allSessions = [...allSessions, ...sessionsWithUserInfo]
        } catch (error) {
          console.error(`Error fetching sessions for user ${user._id}:`, error)
        }
      }
    }

    return NextResponse.json({ sessions: allSessions })
  } catch (error) {
    console.error("Error getting sessions:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
