import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { getUserBalance, updateUserBalance } from "@/lib/auth"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Get user balance
export async function GET() {
  try {
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: string }

    // Get the user's balance
    const balance = await getUserBalance(decoded.id)

    return NextResponse.json({ balance })
  } catch (error) {
    console.error("Error getting balance:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Update user balance
export async function POST(request: Request) {
  try {
    const { amount } = await request.json()
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (typeof amount !== "number") {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: string }

    // Update the user's balance
    const newBalance = await updateUserBalance(decoded.id, amount)

    return NextResponse.json({ success: true, balance: newBalance })
  } catch (error) {
    console.error("Error updating balance:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
