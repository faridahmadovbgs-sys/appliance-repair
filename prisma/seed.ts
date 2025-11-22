import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 10)

  // Create users
  const callCenter = await prisma.user.upsert({
    where: { email: "callcenter@demo.com" },
    update: {},
    create: {
      email: "callcenter@demo.com",
      name: "Call Center Agent",
      password: hashedPassword,
      role: "CALL_CENTER",
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: "manager@demo.com" },
    update: {},
    create: {
      email: "manager@demo.com",
      name: "Manager",
      password: hashedPassword,
      role: "MANAGER",
    },
  })

  const worker = await prisma.user.upsert({
    where: { email: "worker@demo.com" },
    update: {},
    create: {
      email: "worker@demo.com",
      name: "Field Worker",
      password: hashedPassword,
      role: "FIELD_WORKER",
    },
  })

  console.log("Created users:", { callCenter, manager, worker })

  // Create sample work orders
  const order1 = await prisma.workOrder.create({
    data: {
      orderNumber: "WO-000001",
      customerName: "John Smith",
      customerPhone: "555-0100",
      customerAddress: "123 Main St, Anytown, USA",
      serviceType: "PLUMBING",
      description: "Leaking kitchen faucet needs repair",
      priority: "HIGH",
      status: "PENDING",
      createdById: callCenter.id,
    },
  })

  const order2 = await prisma.workOrder.create({
    data: {
      orderNumber: "WO-000002",
      customerName: "Jane Doe",
      customerPhone: "555-0200",
      customerAddress: "456 Oak Ave, Somewhere, USA",
      serviceType: "APPLIANCE_REPAIR",
      description: "Refrigerator not cooling properly",
      priority: "URGENT",
      status: "ASSIGNED",
      createdById: manager.id,
      assignedToId: worker.id,
    },
  })

  const order3 = await prisma.workOrder.create({
    data: {
      orderNumber: "WO-000003",
      customerName: "Bob Johnson",
      customerPhone: "555-0300",
      customerAddress: "789 Pine Rd, Elsewhere, USA",
      serviceType: "HANDYMAN",
      description: "Install ceiling fan in bedroom",
      priority: "MEDIUM",
      status: "PENDING",
      createdById: callCenter.id,
    },
  })

  console.log("Created sample orders:", { order1, order2, order3 })
  console.log("Database seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
