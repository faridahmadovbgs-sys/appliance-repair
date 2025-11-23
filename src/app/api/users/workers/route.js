import { NextResponse } from "next/server"
import { getWorkersByOrganization } from "@/lib/firestore"
import { getCurrentUser } from "@/lib/current-user"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error, { status)
    }

    const userRole = user.role
    const organizationId = user.organizationId
    
    if (userRole !== "MANAGER") {
      return NextResponse.json(
        { error,
        { status)
    }

    if (!organizationId) {
      return NextResponse.json({ error, { status)
    }

    const workers = await getWorkersByOrganization(organizationId)
    
    // Format workers for response
    const formattedWorkers = workers.map(worker => ({
      id,
      firstName,
      lastName,
      email))

    return NextResponse.json(formattedWorkers)
  } catch (error) {
    console.error('Error fetching workers, error)
    return NextResponse.json(
      { error,
      { status)
  }
}
