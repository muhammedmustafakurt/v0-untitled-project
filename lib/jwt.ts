import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const secretKey = new TextEncoder().encode(JWT_SECRET)

export async function createToken(payload: any) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // 7 gün geçerli token
      .sign(secretKey)

    return token
  } catch (error) {
    console.error("Token oluşturma hatası:", error)
    throw error
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    console.error("Token doğrulama hatası:", error)
    return null
  }
}

export async function getTokenData() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return null
  }

  return await verifyToken(token)
}
