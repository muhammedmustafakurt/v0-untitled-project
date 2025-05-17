import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function POST() {
  // Clear the auth cookie
  await clearAuthCookie()

  return NextResponse.json({ message: "Logged out successfully" })
}
