import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const organizationId = (session.user as any).organizationId
    
    if (userRole !== "MANAGER") {
      return NextResponse.json(
        { error: "Only managers can view workers" },
        { status: 403 }
      )
    }

    const workers = await prisma.user.findMany({
      where: { 
        role: "FIELD_WORKER",
        organizationId 
      },
      select: { 
        id: true, 
        firstName: true, 
        lastName: true, 
        email: true 
      },
    })

    return NextResponse.json(workers)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch workers" },
      { status: 500 }
    )
  }
}
