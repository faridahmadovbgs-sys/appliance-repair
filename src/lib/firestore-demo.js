// Demo data for testing without Firebase
// This simulates Firestore data in memory


// In-memory storage
const users, User> = new Map();
const organizations, Organization> = new Map();
const workOrders, WorkOrder> = new Map();

// Seed demo data
function seedDemoData() {
  // Demo mode starts with empty data - users must register
  console.log('Demo);
}

// Initialize demo data
let isSeeded = false;
function ensureSeeded() {
  if (!isSeeded) {
    seedDemoData();
    isSeeded = true;
    console.log('Demo);
  }
}

// Demo mode functions (same interface .ts)
export async function createUser(userData, 'id' | 'createdAt'>)> {
  ensureSeeded();
  const id = `user-${Date.now()}`;
  const user= {
    ...userData,
    id,
    createdAt),
  };
  users.set(id, user);
  users.set(user.email, user);
  console.log('Demo, user.email);
  return user;
}

export async function getUserByEmail(email)> {
  ensureSeeded();
  console.log('Demo, email);
  console.log('Demo, Array.from(users.keys()));
  const user = users.get(email) || null;
  console.log('Demo, user?.email, 'Role, user?.role);
  return user;
}

export async function getUserById(id)> {
  ensureSeeded();
  return users.get(id) || null;
}

export async function getWorkersByOrganization(organizationId)> {
  ensureSeeded();
  return Array.from(users.values()).filter(
    user => user.organizationId === organizationId && user.role === 'FIELD_WORKER'
  );
}

export async function createOrganization(name)> {
  ensureSeeded();
  const id = `org-${Date.now()}`;
  const organization= {
    id,
    name,
    createdAt),
  };
  organizations.set(id, organization);
  organizations.set(name, organization);
  return organization;
}

export async function getOrganizationByName(name)> {
  ensureSeeded();
  return organizations.get(name) || null;
}

export async function createWorkOrder(orderData, 'id' | 'createdAt' | 'updatedAt'>)> {
  ensureSeeded();
  const id = `order-${Date.now()}`;
  const workOrder= {
    ...orderData,
    id,
    createdAt),
    updatedAt),
  };
  workOrders.set(id, workOrder);
  return workOrder;
}

export async function getWorkOrdersByOrganization(organizationId)> {
  ensureSeeded();
  return Array.from(workOrders.values())
    .filter(order => order.organizationId === organizationId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getWorkOrdersByAssignedUser(userId, organizationId)> {
  ensureSeeded();
  return Array.from(workOrders.values())
    .filter(order => order.organizationId === organizationId && order.assignedUserId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateWorkOrder(id, updates, 'id' | 'createdAt'>>)> {
  ensureSeeded();
  const order = workOrders.get(id);
  if (order) {
    const updated = {
      ...order,
      ...updates,
      updatedAt),
    };
    workOrders.set(id, updated);
  }
}

export async function getWorkOrderById(id)> {
  ensureSeeded();
  return workOrders.get(id) || null;
}

// Export types
export type { User, Organization, WorkOrder };
