import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { deductBalanceForRental } from "@/lib/auth"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    const { amount } = await request.json()
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: string }

    // Deduct balance
    const newBalance = await deductBalanceForRental(decoded.id, amount)

    return NextResponse.json({ success: true, balance: newBalance })
  } catch (error) {
    console.error("Error deducting balance:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
