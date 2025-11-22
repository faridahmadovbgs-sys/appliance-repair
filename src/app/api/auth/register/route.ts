import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcrypt"
import { prisma } from "@/lib/prisma"

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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Check if organization exists
    let org = await prisma.organization.findUnique({
      where: { name: organization }
    })

    // Create organization if it doesn't exist
    if (!org) {
      org = await prisma.organization.create({
        data: { name: organization }
      })
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role,
        organizationId: org.id
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: "User created successfully",
        user 
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
