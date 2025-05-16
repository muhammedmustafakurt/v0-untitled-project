import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { id: string }

    // Update user profile
    const client = await clientPromise
    const db = client.db()

    await db.collection("users").updateOne({ _id: new ObjectId(decoded.id) }, { $set: { name } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
