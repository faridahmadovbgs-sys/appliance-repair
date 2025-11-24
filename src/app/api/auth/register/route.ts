import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { createUser, createOrganization, getOrganizationByName, getUserByEmail } from "@/lib/firestore"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, organization, firstName, lastName, password, role } = body

    // Validate required fields
    if (!email || !organization || !firstName || !lastName || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Check if organization exists
    let org = await getOrganizationByName(organization)

    // Create organization if it doesn't exist
    if (!org) {
      org = await createOrganization(organization)
    }

    // Create user
    const user = await createUser({
      email,
      firstName,
      lastName,
      passwordHash: hashedPassword,
      role: role as 'CALL_CENTER' | 'MANAGER' | 'FIELD_WORKER',
      organizationId: org.id,
      organizationName: org.name
    })

    // Return user data (excluding password)
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
