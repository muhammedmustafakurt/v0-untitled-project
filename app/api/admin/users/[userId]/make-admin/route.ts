import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { makeUserAdmin, isUserAdmin } from "@/lib/auth"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
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

    // Make the user an admin
    await makeUserAdmin(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error making user admin:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
