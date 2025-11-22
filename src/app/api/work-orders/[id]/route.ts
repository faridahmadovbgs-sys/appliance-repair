import { NextRequest, NextResponse } from "next/server"
import { getWorkOrderById, updateWorkOrder, getUserById } from "@/lib/firestore"
import { auth } from "@/lib/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, assignedUserId, notes } = body

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    const order = await getWorkOrderById(id)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Authorization checks
    if (userRole === "FIELD_WORKER") {
      if (order.assignedUserId !== userId) {
        return NextResponse.json(
          { error: "You can only update your assigned orders" },
          { status: 403 }
        )
      }
      // Field workers can only update status
      await updateWorkOrder(id, {
        status,
      })
      const updatedOrder = await getWorkOrderById(id)
      return NextResponse.json(updatedOrder)
    } else if (userRole === "MANAGER") {
      // Managers can update everything
      const updates: any = {
        status,
      }
      
      if (assignedUserId) {
        const assignedUser = await getUserById(assignedUserId)
        if (assignedUser) {
          updates.assignedUserId = assignedUserId
          updates.assignedUserName = `${assignedUser.firstName} ${assignedUser.lastName}`
        }
      }
      
      await updateWorkOrder(id, updates)
      const updatedOrder = await getWorkOrderById(id)
      return NextResponse.json(updatedOrder)
    } else if (userRole === "CALL_CENTER") {
      // Call center can update notes
      await updateWorkOrder(id, { status })
      const updatedOrder = await getWorkOrderById(id)
      return NextResponse.json(updatedOrder)
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  } catch (error) {
    console.error('Error updating work order:', error)
    return NextResponse.json(
      { error: "Failed to update work order" },
      { status: 500 }
    )
  }
}
