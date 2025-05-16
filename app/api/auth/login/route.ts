import { NextResponse } from "next/server"
import { findUserByEmail, validatePassword } from "@/lib/auth"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await validatePassword(user, password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create a JWT token
    const token = sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

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
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        balance: user.balance || 0,
        isAdmin: user.isAdmin || false,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
