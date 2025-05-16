import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById } from "@/lib/auth"

// JWT secret'ı buffer'a çevirme
const textEncoder = new TextEncoder()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const secretKey = textEncoder.encode(JWT_SECRET)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    try {
      // Verify the token
      const { payload } = await jwtVerify(token, secretKey)
      const userId = payload.id as string

      // Get the user from the database
      const user = await findUserById(userId)

      if (!user) {
        return NextResponse.json({ user: null }, { status: 401 })
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
      // Token geçersizse cookie'yi temizle
      const cookieStore = await cookies()
      cookieStore.set({
        name: "auth_token",
        value: "",
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      return NextResponse.json({ user: null }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
