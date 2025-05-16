import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register" || path === "/_next" || path.includes("/api/auth/")

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
      verify(token, JWT_SECRET)
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
      const decoded = verify(token, JWT_SECRET) as { id: string; isAdmin?: boolean }

      // If the user is not an admin, redirect to home
      if (!decoded.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      // If token verification fails, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes that handle authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
