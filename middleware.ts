import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// JWT secret'ı buffer'a çevirme
const textEncoder = new TextEncoder()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const secretKey = textEncoder.encode(JWT_SECRET)

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/admin/login" ||
    path.startsWith("/_next") ||
    path.includes("/api/auth/") ||
    path.includes("/favicon.ico") ||
    path.includes(".png") ||
    path.includes(".jpg") ||
    path.includes(".svg")

  // Define admin paths
  const isAdminPath = path.startsWith("/admin") || path.includes("/api/admin/")

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value

  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the path is login or register and there's a token, redirect to dashboard
  if ((path === "/login" || path === "/register") && token) {
    try {
      // Verify the token
      const { payload } = await jwtVerify(token, secretKey)
      
      // Admin kullanıcıları admin paneline yönlendir
      if (payload.isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      
      return NextResponse.redirect(new URL("/", request.url))
    } catch (error) {
      // If token verification fails, clear the cookie and continue
      const response = NextResponse.next()
      response.cookies.set({
        name: "auth_token",
        value: "",
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      return response
    }
  }

  // If the path is admin and there's a token, check if the user is an admin
  if (isAdminPath && token) {
    try {
      // Verify the token
      const { payload } = await jwtVerify(token, secretKey)

      // Admin kontrolü
      if (!payload.isAdmin) {
        // Admin değilse ana sayfaya yönlendir
        return NextResponse.redirect(new URL("/", request.url))
      }

      return NextResponse.next()
    } catch (error) {
      // If token verification fails, redirect to admin login
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image).*)",
  ],
}
