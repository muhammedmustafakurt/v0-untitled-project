import { NextResponse } from "next/server"
import { findUserByEmail, validatePassword } from "@/lib/auth"
import { cookies } from "next/headers"
import { SignJWT } from "jose"

// JWT secret'ı buffer'a çevirme
const textEncoder = new TextEncoder()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const secretKey = textEncoder.encode(JWT_SECRET)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email ve şifre gereklidir" }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Geçersiz kimlik bilgileri" }, { status: 401 })
    }

    const isValid = await validatePassword(user, password)
    if (!isValid) {
      return NextResponse.json({ error: "Geçersiz kimlik bilgileri" }, { status: 401 })
    }

    // Admin kontrolü
    if (!user.isAdmin) {
      return NextResponse.json({ error: "Admin yetkisi gereklidir" }, { status: 403 })
    }

    // Create a JWT token
    const token = await new SignJWT({
      id: user._id,
      email: user.email,
      isAdmin: true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey)

    // Set the token in a cookie
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    return NextResponse.json({
      message: "Admin girişi başarılı",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        balance: user.balance || 0,
        isAdmin: true,
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
