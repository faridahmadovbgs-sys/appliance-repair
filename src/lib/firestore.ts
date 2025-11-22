// Simplified Firestore module with build-time fallback support
let firestoreModule: any = null;

// Check if we're in a build environment or missing credentials
const isFirebaseAvailable = () => {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    typeof window === 'undefined' // Server-side only
  );
};

// Check if we should use demo mode
const useDemoMode = process.env.NEXT_PUBLIC_USE_DEMO_MODE === 'true' || !isFirebaseAvailable();

console.log('Firestore: Demo mode enabled:', useDemoMode);
console.log('Firestore: Firebase available:', isFirebaseAvailable());
console.log('Firestore: Environment check:', {
  hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
  hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
  hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
});

// Lazy load Firebase only when needed and available
const getFirestoreModule = async () => {
  if (!isFirebaseAvailable()) {
    return null;
  }

  if (!firestoreModule) {
    try {
      const { initializeApp, cert, getApps } = await import('firebase-admin/app');
      const { getFirestore } = await import('firebase-admin/firestore');

      if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
          }),
        });
      }

      firestoreModule = getFirestore();
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      return null;
    }
  }

  return firestoreModule;
};

// Data types
export interface User {
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

export interface Organization {
  id: string;
  name: string;
  createdAt: Date;
}

export interface WorkOrder {
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

const FIREBASE_ERROR = 'Firebase Firestore is not configured. Please check FIREBASE_SETUP.md for setup instructions.';

// Helper to ensure Firebase is available
async function ensureFirestore() {
  // Use demo mode if Firebase not available
  if (useDemoMode) {
    console.log('Using demo mode (Firebase not configured)');
    return null;
  }
  
  const db = await getFirestoreModule();
  if (!db) {
    throw new Error(FIREBASE_ERROR);
  }
  return db;
}

// User operations
export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.createUser(userData);
  }
  
  const db = await ensureFirestore();
  const userRef = db.collection('users').doc();
  const user: User = {
    ...userData,
    id: userRef.id,
    createdAt: new Date(),
  };
  
  await userRef.set(user);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (useDemoMode) {
    console.log('Firestore: Using demo mode for getUserByEmail');
    const demo = await import('./firestore-demo');
    return demo.getUserByEmail(email);
  }
  
  console.log('Firestore: Using real Firebase for getUserByEmail');
  const db = await ensureFirestore();
  const snapshot = await db.collection('users').where('email', '==', email).get();
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() as User;
}

export async function getUserById(id: string): Promise<User | null> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getUserById(id);
  }
  
  const db = await ensureFirestore();
  const doc = await db.collection('users').doc(id).get();
  if (!doc.exists) return null;
  
  return doc.data() as User;
}

export async function getWorkersByOrganization(organizationId: string): Promise<User[]> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getWorkersByOrganization(organizationId);
  }
  
  const db = await ensureFirestore();
  const snapshot = await db.collection('users')
    .where('organizationId', '==', organizationId)
    .where('role', '==', 'FIELD_WORKER')
    .get();
  
  return snapshot.docs.map((doc: any) => doc.data() as User);
}

// Organization operations
export async function createOrganization(name: string): Promise<Organization> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.createOrganization(name);
  }
  
  const db = await ensureFirestore();
  const orgRef = db.collection('organizations').doc();
  const organization: Organization = {
    id: orgRef.id,
    name,
    createdAt: new Date(),
  };
  
  await orgRef.set(organization);
  return organization;
}

export async function getOrganizationByName(name: string): Promise<Organization | null> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getOrganizationByName(name);
  }
  
  const db = await ensureFirestore();
  const snapshot = await db.collection('organizations').where('name', '==', name).get();
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() as Organization;
}

// Work Order operations
export async function createWorkOrder(orderData: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.createWorkOrder(orderData);
  }
  
  const db = await ensureFirestore();
  const orderRef = db.collection('workOrders').doc();
  const workOrder: WorkOrder = {
    ...orderData,
    id: orderRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await orderRef.set(workOrder);
  return workOrder;
}

export async function getWorkOrdersByOrganization(organizationId: string): Promise<WorkOrder[]> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getWorkOrdersByOrganization(organizationId);
  }
  
  const db = await ensureFirestore();
  const snapshot = await db.collection('workOrders')
    .where('organizationId', '==', organizationId)
    .orderBy('createdAt', 'desc')
    .get();
  
  return snapshot.docs.map((doc: any) => ({
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  } as WorkOrder));
}

export async function getWorkOrdersByAssignedUser(userId: string, organizationId: string): Promise<WorkOrder[]> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getWorkOrdersByAssignedUser(userId, organizationId);
  }
  
  const db = await ensureFirestore();
  const snapshot = await db.collection('workOrders')
    .where('organizationId', '==', organizationId)
    .where('assignedUserId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  
  return snapshot.docs.map((doc: any) => ({
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  } as WorkOrder));
}

export async function updateWorkOrder(id: string, updates: Partial<Omit<WorkOrder, 'id' | 'createdAt'>>): Promise<void> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.updateWorkOrder(id, updates);
  }
  
  const db = await ensureFirestore();
  await db.collection('workOrders').doc(id).update({
    ...updates,
    updatedAt: new Date(),
  });
}

export async function getWorkOrderById(id: string): Promise<WorkOrder | null> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getWorkOrderById(id);
  }
  
  const db = await ensureFirestore();
  const doc = await db.collection('workOrders').doc(id).get();
  if (!doc.exists) return null;
  
  const data = doc.data();
  return {
    ...data,
    createdAt: data!.createdAt.toDate(),
    updatedAt: data!.updatedAt.toDate(),
  } as WorkOrder;
}