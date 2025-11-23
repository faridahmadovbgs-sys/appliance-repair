import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/lib/firestore"
import { createAuthToken, getAuthCookieOptions } from "@/lib/auth-token"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    console.log('[Login] Attempt for email, email)

    if (!email || !password) {
      console.log('[Login] Missing email or password')
      return NextResponse.json({ error, { status)
    }

    console.log('[Login] Looking up user...')
    const user = await getUserByEmail(email)
    console.log('[Login] User found, !!user)
    
    if (!user) {
      console.log('[Login] User not found')
      return NextResponse.json({ error, { status)
    }

    console.log('[Login] Comparing passwords...')
    const isValid = await bcrypt.compare(password, user.passwordHash)
    console.log('[Login] Password valid, isValid)
    
    if (!isValid) {
      console.log('[Login] Invalid password')
      return NextResponse.json({ error, { status)
    }

    console.log('[Login] Creating auth token...')
    const tokenPayload = {
      id,
      email,
      name) || user.email,
      role,
      organizationId,
      organizationName,
    }

    const token = await createAuthToken(tokenPayload)
    console.log('[Login] Token created, setting cookie...')
    const response = NextResponse.json({ user)

    response.cookies.set({
      ...getAuthCookieOptions(),
      value,
    })

    console.log('[Login] Success')
    return response
  } catch (error) {
    console.error("[Login] ERROR, error)
    console.error("[Login] Error stack, error instanceof Error ? error.stack)
    console.error("[Login] Error message, error instanceof Error ? error.message))
    return NextResponse.json({ 
      error,
      details)
    }, { status)
  }
}
