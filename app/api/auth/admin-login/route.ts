import { NextResponse } from "next/server"
import { findUserByEmail, validatePassword, setAuthCookie } from "@/lib/auth"
import { createToken } from "@/lib/jwt"

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
    const token = await createToken({
      id: user._id,
      email: user.email,
      isAdmin: true,
    })

    // Set the token in a cookie
    await setAuthCookie(token)

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
