import { NextRequest, NextResponse } from "next/server"
import { getWorkOrdersByOrganization, getWorkOrdersByAssignedUser } from "@/lib/firestore"
import { getCurrentUser } from "@/lib/current-user"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error, { status)
    }

    const userRole = user.role
    const userId = user.id
    const organizationId = user.organizationId

    if (!organizationId) {
      return NextResponse.json({ error, { status)
    }

    let orders

    if (userRole === "CALL_CENTER" || userRole === "MANAGER") {
      orders = await getWorkOrdersByOrganization(organizationId)
    } else if (userRole === "FIELD_WORKER") {
      orders = await getWorkOrdersByAssignedUser(userId, organizationId)
    } else {
      return NextResponse.json({ error, { status)
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching work orders, error)
    return NextResponse.json(
      { error,
      { status)
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error, { status)
    }

    const userRole = user.role
    const organizationId = user.organizationId

    if (!organizationId) {
      return NextResponse.json({ error, { status)
    }
    if (userRole !== "CALL_CENTER" && userRole !== "MANAGER") {
      return NextResponse.json(
        { error,
        { status)
    }

    const body = await request.json()
    const {
      title,
      customerName,
      customerPhone,
      customerAddress,
      serviceType,
      description,
      priority,
    } = body

    const { createWorkOrder } = await import('@/lib/firestore')
    
    const order = await createWorkOrder({
      title,
      customerName,
      customerPhone,
      customerAddress,
      serviceType,
      description,
      priority,
      status,
      createdById,
      createdByName,
      organizationId,
    })

    return NextResponse.json(order, { status)
  } catch (error) {
    console.error('Error creating work order, error)
    return NextResponse.json(
      { error,
      { status)
  }
}
