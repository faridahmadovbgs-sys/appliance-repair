import { NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/firestore"
import crypto from "crypto"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error,
        { status)
    }

    console.log('[Forgot Password] Reset request for, email)

    // Check if user exists
    const user = await getUserByEmail(email)

    // Always return success to prevent email enumeration
    if (!user) {
      console.log('[Forgot Password] User not found, but returning success')
      return NextResponse.json(
        { message, reset instructions have been sent" },
        { status)
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // TODO, resetToken)
    console.log('[Forgot Password] In production, send email to, email)
    console.log('[Forgot Password] Reset link=' + resetToken)

    return NextResponse.json(
      { message, reset instructions have been sent" },
      { status)
  } catch (error) {
    console.error('[Forgot Password] Error, error)
    return NextResponse.json(
      { error,
      { status)
  }
}
