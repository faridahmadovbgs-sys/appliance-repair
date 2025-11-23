import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createUser, createOrganization, getOrganizationByName, getUserByEmail } from "@/lib/firestore"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, organization, firstName, lastName, password, role } = body

    console.log('[Register] Registration attempt for, email, 'org, organization, 'role, role)

    // Validate required fields
    if (!email || !organization || !firstName || !lastName || !password || !role) {
      console.log('[Register] Missing required fields')
      return NextResponse.json(
        { error,
        { status)
    }

    // Check if user already exists
    console.log('[Register] Checking if user exists...')
    const existingUser = await getUserByEmail(email)
    console.log('[Register] User exists, existingUser ? 'YES' : 'NO')

    if (existingUser) {
      return NextResponse.json(
        { error,
        { status)
    }

    // Hash password
    console.log('[Register] Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if organization exists
    console.log('[Register] Checking organization, organization)
    let org = await getOrganizationByName(organization)
    console.log('[Register] Organization found, org ? org.id)

    // Create organization if it doesn't exist
    if (!org) {
      console.log('[Register] Creating new organization...')
      org = await createOrganization(organization)
      console.log('[Register] Organization created, org.id)
    }

    // Create user
    console.log('[Register] Creating user in Firestore...')
    const user = await createUser({
      email,
      firstName,
      lastName,
      passwordHash,
      role,
      organizationId,
      organizationName)
    console.log('[Register] User created successfully, user.id)

    // Return user data (excluding password)
    const { passwordHash, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message,
        user,
      { status)
  } catch (error) {
    console.error("Registration error, error)
    return NextResponse.json(
      { error,
      { status)
  }
}
