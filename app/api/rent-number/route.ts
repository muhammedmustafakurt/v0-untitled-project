import { NextResponse } from "next/server"
import { createSmsSession } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { serviceId } = body

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    console.log(`Attempting to rent number with serviceId: ${serviceId}`)

    const session = await createSmsSession(serviceId)
    console.log("Session created successfully:", session)

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error renting number:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: `Failed to rent number: ${errorMessage}` }, { status: 500 })
  }
}
