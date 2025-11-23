import { NextRequest, NextResponse } from "next/server"
import { getWorkOrderById, updateWorkOrder, getUserById } from "@/lib/firestore"
import { getCurrentUser } from "@/lib/current-user"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(
  request,
  { params }: { params) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error, { status)
    }

    const { id } = await params
    const body = await request.json()
    const { status, assignedUserId, notes } = body

    const userRole = user.role
    const userId = user.id

    const order = await getWorkOrderById(id)
    if (!order) {
      return NextResponse.json({ error, { status)
    }

    // Authorization checks
    if (userRole === "FIELD_WORKER") {
      if (order.assignedUserId !== userId) {
        return NextResponse.json(
          { error,
          { status)
      }
      // Field workers can only update status
      await updateWorkOrder(id, {
        status,
      })
      const updatedOrder = await getWorkOrderById(id)
      return NextResponse.json(updatedOrder)
    } else if (userRole === "MANAGER") {
      // Managers can update everything
      const updates= {
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

    return NextResponse.json({ error, { status)
  } catch (error) {
    console.error('Error updating work order, error)
    return NextResponse.json(
      { error,
      { status)
  }
}
