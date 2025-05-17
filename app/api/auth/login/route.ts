import { NextResponse } from "next/server"
import { findUserByEmail, validatePassword, setAuthCookie } from "@/lib/auth"
import { createToken } from "@/lib/jwt"

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
    const token = await createToken({
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin || false,
    })

    // Set the token in a cookie
    await setAuthCookie(token)

    // Debug için log ekledik
    console.log("Login successful, user:", {
      id: user._id,
      email: user.email,
      name: user.name,
      balance: user.balance || 0,
      isAdmin: user.isAdmin || false,
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
