import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    const user = await getCurrentUser(request)
    const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    if (!user) {
      // Log unauthorized admin access attempt
      console.warn(`Unauthorized admin access attempt from IP: ${clientIP} to ${pathname}`)
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (user.role !== "admin") {
      // Log non-admin user trying to access admin routes
      console.warn(`Non-admin user ${user.email} attempted to access ${pathname} from IP: ${clientIP}`)
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Log successful admin access
    console.log(`Admin ${user.email} accessed ${pathname} from IP: ${clientIP}`)
  }

  // Checkout protection
  if (pathname.startsWith("/checkout")) {
    const user = await getCurrentUser(request)

    if (!user) {
      // Redirect to home page if not authenticated
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
}
