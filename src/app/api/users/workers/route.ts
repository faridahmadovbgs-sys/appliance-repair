import { NextRequest, NextResponse } from "next/server"
import { getWorkersByOrganization } from "@/lib/firestore"
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

    const workers = await getWorkersByOrganization(organizationId)
    
    // Format workers for response
    const formattedWorkers = workers.map(worker => ({
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      email: worker.email
    }))

    return NextResponse.json(formattedWorkers)
  } catch (error) {
    console.error('Error fetching workers:', error)
    return NextResponse.json(
      { error: "Failed to fetch workers" },
      { status: 500 }
    )
  }
}
