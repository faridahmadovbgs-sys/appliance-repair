import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    let orders

    if (userRole === "CALL_CENTER" || userRole === "MANAGER") {
      orders = await prisma.workOrder.findMany({
        include: {
          createdBy: { select: { name: true, email: true } },
          assignedTo: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    } else if (userRole === "FIELD_WORKER") {
      orders = await prisma.workOrder.findMany({
        where: { assignedToId: userId },
        include: {
          createdBy: { select: { name: true, email: true } },
          assignedTo: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 })
    }

    return NextResponse.json(orders)
  } catch (error) {
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
      customerName,
      customerPhone,
      customerAddress,
      serviceType,
      description,
      priority,
    } = body

    const orderCount = await prisma.workOrder.count()
    const orderNumber = `WO-${String(orderCount + 1).padStart(6, "0")}`

    const order = await prisma.workOrder.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerAddress,
        serviceType,
        description,
        priority: priority || "MEDIUM",
        createdById: (session.user as any).id,
      },
      include: {
        createdBy: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create work order" },
      { status: 500 }
    )
  }
}
