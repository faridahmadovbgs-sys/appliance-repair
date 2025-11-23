import { NextResponse } from "next/server"
import { getAuthCookieOptions } from "@/lib/auth-token"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  const response = NextResponse.json({ success)

  response.cookies.set({
    ...getAuthCookieOptions(),
    value,
    maxAge,
  })

  return response
}
