import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
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
  if (!isPublicPath && !token && !isAdminPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the path is login or register and there's a token, redirect to dashboard
  if ((path === "/login" || path === "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the path is admin and there's no token, redirect to admin login
  if (isAdminPath && !token && path !== "/admin/login" && path !== "/admin/register") {
    return NextResponse.redirect(new URL("/admin/login", request.url))
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
