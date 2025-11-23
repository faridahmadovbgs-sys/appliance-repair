import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/current-user"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ user, { status)
  }

  return NextResponse.json({ user }, { status)
}
