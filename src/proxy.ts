import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function proxy(request: NextRequest) {
  // Allow public paths
  const publicPaths = [
    "/login",
    "/register",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/icon",
    "/manifest.json",
    "/sw.js",
    "/workbox",
    "/firebase-messaging-sw.js",
  ]

  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  // For now, allow all requests (NextAuth handles auth in pages)
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)"
  ],
}
