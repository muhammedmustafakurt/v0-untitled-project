import { NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await createUser({ email, password, name })

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
