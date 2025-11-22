import { NextRequest, NextResponse } from "next/server"
import { getWorkOrdersByOrganization, getWorkOrdersByAssignedUser } from "@/lib/firestore"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id
    const organizationId = (session.user as any).organizationId

    let orders

    if (userRole === "CALL_CENTER" || userRole === "MANAGER") {
      orders = await getWorkOrdersByOrganization(organizationId)
    } else if (userRole === "FIELD_WORKER") {
      orders = await getWorkOrdersByAssignedUser(userId, organizationId)
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 })
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching work orders:', error)
    return NextResponse.json(
      { error: "Failed to fetch work orders" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "CALL_CENTER" && userRole !== "MANAGER") {
      return NextResponse.json(
        { error: "Only call center and managers can create orders" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      customerName,
      customerPhone,
      customerAddress,
      description,
      priority,
    } = body

    const { createWorkOrder } = await import('@/lib/firestore')
    
    const order = await createWorkOrder({
      title: title || 'New Work Order',
      customerName,
      customerPhone,
      customerAddress,
      description,
      priority: priority || "MEDIUM",
      status: "PENDING",
      createdById: (session.user as any).id,
      createdByName: session.user.name || session.user.email || 'Unknown',
      organizationId: (session.user as any).organizationId,
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating work order:', error)
    return NextResponse.json(
      { error: "Failed to create work order" },
      { status: 500 }
    )
  }
}
