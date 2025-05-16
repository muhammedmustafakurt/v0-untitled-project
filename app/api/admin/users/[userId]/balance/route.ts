import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { updateUserBalance } from "@/lib/auth"

// JWT secret'ı buffer'a çevirme
const textEncoder = new TextEncoder()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const secretKey = textEncoder.encode(JWT_SECRET)

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const body = await request.json()
    const { amount } = body
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 })
    }

    if (typeof amount !== "number") {
      return NextResponse.json({ error: "Geçerli bir miktar gerekli" }, { status: 400 })
    }

    // Verify the token
    const { payload } = await jwtVerify(token, secretKey)

    // Check if user is admin
    if (!payload.isAdmin) {
      return NextResponse.json({ error: "Admin yetkisi gerekli" }, { status: 403 })
    }

    // Update the user's balance
    const newBalance = await updateUserBalance(userId, amount)

    return NextResponse.json({ success: true, balance: newBalance })
  } catch (error) {
    console.error("Error updating balance:", error)
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
