import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear the auth cookie
  cookies().set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })

  return NextResponse.json({ message: "Logged out successfully" })
}
