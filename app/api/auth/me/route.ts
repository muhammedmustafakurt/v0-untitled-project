import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { findUserById } from "@/lib/auth"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET() {
  try {
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: string }

    // Get the user from the database
    const user = await findUserById(decoded.id)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        balance: user.balance || 0,
        isAdmin: user.isAdmin || false,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ user: null })
  }
}
