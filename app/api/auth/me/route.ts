import { NextResponse } from "next/server"
import { findUserById } from "@/lib/auth"
import { getTokenData } from "@/lib/jwt"

export async function GET() {
  try {
    const payload = await getTokenData()

    // Debug için log ekledik
    console.log("ME API - Token payload:", payload)

    if (!payload || !payload.id) {
      console.log("ME API - No valid token found")
      return NextResponse.json({ user: null })
    }

    // Get the user from the database
    const user = await findUserById(payload.id as string)

    if (!user) {
      console.log("ME API - User not found for id:", payload.id)
      return NextResponse.json({ user: null })
    }

    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      balance: user.balance || 0,
      isAdmin: user.isAdmin || false,
    }

    // Debug için log ekledik
    console.log("ME API - User data:", userData)

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ user: null })
  }
}
