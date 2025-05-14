import { NextResponse } from "next/server"
import { autoRentPhoneNumber } from "@/lib/api"

export async function POST() {
  try {
    console.log("API Route: Auto-renting phone number")
    const session = await autoRentPhoneNumber()
    console.log("API Route: Session created:", session)

    return NextResponse.json(session)
  } catch (error) {
    console.error("API Route: Error auto-renting number:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
