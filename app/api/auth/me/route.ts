import { NextResponse } from "next/server"
import { findUserById } from "@/lib/auth"
import { getTokenData } from "@/lib/jwt"

export async function GET() {
  try {
    const payload = await getTokenData()

    if (!payload || !payload.id) {
      return NextResponse.json({ user: null })
    }

    // Get the user from the database
    const user = await findUserById(payload.id as string)

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
