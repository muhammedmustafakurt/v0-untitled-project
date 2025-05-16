import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { deductBalanceForRental } from "@/lib/auth"

// JWT secret'ı buffer'a çevirme
const textEncoder = new TextEncoder()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const secretKey = textEncoder.encode(JWT_SECRET)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount } = body
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 })
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Geçerli bir miktar gerekli" }, { status: 400 })
    }

    // Verify the token
    const { payload } = await jwtVerify(token, secretKey)
    const userId = payload.id as string

    // Deduct balance
    const newBalance = await deductBalanceForRental(userId, amount)

    return NextResponse.json({ success: true, balance: newBalance })
  } catch (error) {
    console.error("Error deducting balance:", error)
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
