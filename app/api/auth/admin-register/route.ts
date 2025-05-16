import { NextResponse } from "next/server"
import { createAdminUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email ve şifre gereklidir" }, { status: 400 })
    }

    const user = await createAdminUser({ email, password, name })

    return NextResponse.json({
      message: "Admin kullanıcı başarıyla oluşturuldu",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Admin registration error:", error)
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
