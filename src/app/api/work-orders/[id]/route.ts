import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
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
    const { status, assignedToId, notes } = body

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    const order = await prisma.workOrder.findUnique({ where: { id } })
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Authorization checks
    if (userRole === "FIELD_WORKER") {
      if (order.assignedToId !== userId) {
        return NextResponse.json(
          { error: "You can only update your assigned orders" },
          { status: 403 }
        )
      }
      // Field workers can only update status and notes
      const updatedOrder = await prisma.workOrder.update({
        where: { id },
        data: {
          status,
          notes,
          completedAt: status === "COMPLETED" ? new Date() : order.completedAt,
        },
        include: {
          createdBy: { select: { firstName: true, lastName: true, email: true } },
          assignedTo: { select: { firstName: true, lastName: true, email: true } },
        },
      })
      return NextResponse.json(updatedOrder)
    } else if (userRole === "MANAGER") {
      // Managers can update everything
      const updatedOrder = await prisma.workOrder.update({
        where: { id },
        data: {
          status,
          assignedToId,
          notes,
          completedAt: status === "COMPLETED" ? new Date() : order.completedAt,
        },
        include: {
          createdBy: { select: { firstName: true, lastName: true, email: true } },
          assignedTo: { select: { firstName: true, lastName: true, email: true } },
        },
      })
      return NextResponse.json(updatedOrder)
    } else if (userRole === "CALL_CENTER") {
      // Call center can update notes
      const updatedOrder = await prisma.workOrder.update({
        where: { id },
        data: { notes },
        include: {
          createdBy: { select: { firstName: true, lastName: true, email: true } },
          assignedTo: { select: { firstName: true, lastName: true, email: true } },
        },
      })
      return NextResponse.json(updatedOrder)
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update work order" },
      { status: 500 }
    )
  }
}
