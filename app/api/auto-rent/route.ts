import { NextResponse } from "next/server"
import { autoRentPhoneNumber } from "@/lib/api"

export async function POST() {
  try {
    const session = await autoRentPhoneNumber()

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error auto-renting number:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: `Failed to rent number: ${errorMessage}` }, { status: 500 })
  }
}
