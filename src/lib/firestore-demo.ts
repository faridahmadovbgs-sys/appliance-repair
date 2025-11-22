// Demo data for testing without Firebase
// This simulates Firestore data in memory

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CALL_CENTER' | 'MANAGER' | 'FIELD_WORKER';
  organizationId: string;
  organizationName: string;
  passwordHash: string;
  createdAt: Date;
}

interface Organization {
  id: string;
  name: string;
  createdAt: Date;
}

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedUserId?: string;
  assignedUserName?: string;
  organizationId: string;
  createdById: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
const users: Map<string, User> = new Map();
const organizations: Map<string, Organization> = new Map();
const workOrders: Map<string, WorkOrder> = new Map();

// Seed demo data
function seedDemoData() {
  // Create demo organization
  const demoOrg: Organization = {
    id: 'demo-org-1',
    name: 'Demo Repair Company',
    createdAt: new Date(),
  };
  organizations.set(demoOrg.id, demoOrg);

  // Create demo users (password: password123)
  const passwordHash = '$2b$10$0CkFnjP7HP3J92APrDyW2OmNPWiEMSphzoYof628TvB4BH69DCwh.';
  const demoUsers: User[] = [
    {
      id: 'demo-user-1',
      email: 'manager@demo.com',
      firstName: 'John',
      lastName: 'Manager',
      role: 'MANAGER',
      organizationId: demoOrg.id,
      organizationName: demoOrg.name,
      passwordHash,
      createdAt: new Date(),
    },
    {
      id: 'demo-user-2',
      email: 'callcenter@demo.com',
      firstName: 'Jane',
      lastName: 'CallCenter',
      role: 'CALL_CENTER',
      organizationId: demoOrg.id,
      organizationName: demoOrg.name,
      passwordHash,
      createdAt: new Date(),
    },
    {
      id: 'demo-user-3',
      email: 'worker@demo.com',
      firstName: 'Bob',
      lastName: 'Worker',
      role: 'FIELD_WORKER',
      organizationId: demoOrg.id,
      organizationName: demoOrg.name,
      passwordHash,
      createdAt: new Date(),
    },
  ];

  demoUsers.forEach(user => users.set(user.id, user));
  demoUsers.forEach(user => users.set(user.email, user));

  // Create demo work orders
  const demoOrders: WorkOrder[] = [
    {
      id: 'demo-order-1',
      title: 'Refrigerator Repair',
      description: 'Fridge not cooling properly',
      customerName: 'Alice Smith',
      customerPhone: '555-0101',
      customerAddress: '123 Main St',
      status: 'PENDING',
      priority: 'HIGH',
      organizationId: demoOrg.id,
      createdById: demoUsers[1].id,
      createdByName: `${demoUsers[1].firstName} ${demoUsers[1].lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'demo-order-2',
      title: 'Dishwasher Installation',
      description: 'Install new dishwasher',
      customerName: 'Bob Johnson',
      customerPhone: '555-0102',
      customerAddress: '456 Oak Ave',
      status: 'ASSIGNED',
      priority: 'MEDIUM',
      assignedUserId: demoUsers[2].id,
      assignedUserName: `${demoUsers[2].firstName} ${demoUsers[2].lastName}`,
      organizationId: demoOrg.id,
      createdById: demoUsers[0].id,
      createdByName: `${demoUsers[0].firstName} ${demoUsers[0].lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  demoOrders.forEach(order => workOrders.set(order.id, order));
}

// Initialize demo data
seedDemoData();

// Demo mode functions (same interface as firestore.ts)
export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const id = `user-${Date.now()}`;
  const user: User = {
    ...userData,
    id,
    createdAt: new Date(),
  };
  users.set(id, user);
  users.set(user.email, user);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.get(email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  return users.get(id) || null;
}

export async function getWorkersByOrganization(organizationId: string): Promise<User[]> {
  return Array.from(users.values()).filter(
    user => user.organizationId === organizationId && user.role === 'FIELD_WORKER'
  );
}

export async function createOrganization(name: string): Promise<Organization> {
  const id = `org-${Date.now()}`;
  const organization: Organization = {
    id,
    name,
    createdAt: new Date(),
  };
  organizations.set(id, organization);
  organizations.set(name, organization);
  return organization;
}

export async function getOrganizationByName(name: string): Promise<Organization | null> {
  return organizations.get(name) || null;
}

export async function createWorkOrder(orderData: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> {
  const id = `order-${Date.now()}`;
  const workOrder: WorkOrder = {
    ...orderData,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  workOrders.set(id, workOrder);
  return workOrder;
}

export async function getWorkOrdersByOrganization(organizationId: string): Promise<WorkOrder[]> {
  return Array.from(workOrders.values())
    .filter(order => order.organizationId === organizationId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getWorkOrdersByAssignedUser(userId: string, organizationId: string): Promise<WorkOrder[]> {
  return Array.from(workOrders.values())
    .filter(order => order.organizationId === organizationId && order.assignedUserId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateWorkOrder(id: string, updates: Partial<Omit<WorkOrder, 'id' | 'createdAt'>>): Promise<void> {
  const order = workOrders.get(id);
  if (order) {
    const updated = {
      ...order,
      ...updates,
      updatedAt: new Date(),
    };
    workOrders.set(id, updated);
  }
}

export async function getWorkOrderById(id: string): Promise<WorkOrder | null> {
  return workOrders.get(id) || null;
}

// Export types
export type { User, Organization, WorkOrder };
