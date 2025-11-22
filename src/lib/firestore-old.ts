import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Check if Firebase credentials are available
const hasFirebaseCredentials = () => {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
};

// Initialize Firebase Admin (server-side)
let db: any = null;

const initializeFirebase = () => {
  if (!hasFirebaseCredentials()) {
    console.warn('Firebase credentials not found. Skipping Firebase initialization.');
    return null;
  }

  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      return null;
    }
  }

  return getFirestore();
};

// Initialize database connection
db = initializeFirebase();

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

// Helper function to check if Firebase is available
function ensureFirebaseInitialized() {
  if (!db) {
    throw new Error('Firebase is not initialized. Please check your environment variables.');
  }
  return db;
}

// User operations
export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const database = ensureFirebaseInitialized();
  const userRef = database.collection('users').doc();
  const user: User = {
    ...userData,
    id: userRef.id,
    createdAt: new Date(),
  };
  
  await userRef.set(user);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('users').where('email', '==', email).get();
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const database = ensureFirebaseInitialized();
  const doc = await database.collection('users').doc(id).get();
  if (!doc.exists) return null;
  
  return doc.data() as User;
}

export async function getWorkersByOrganization(organizationId: string): Promise<User[]> {
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('users')
    .where('organizationId', '==', organizationId)
    .where('role', '==', 'FIELD_WORKER')
    .get();
  
  return snapshot.docs.map((doc: any) => doc.data() as User);
}

// Organization operations
export async function createOrganization(name: string): Promise<Organization> {
  const database = ensureFirebaseInitialized();
  const orgRef = database.collection('organizations').doc();
  const organization: Organization = {
    id: orgRef.id,
    name,
    createdAt: new Date(),
  };
  
  await orgRef.set(organization);
  return organization;
}

export async function getOrganizationByName(name: string): Promise<Organization | null> {
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('organizations').where('name', '==', name).get();
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() as Organization;
}

// Work Order operations
export async function createWorkOrder(orderData: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> {
  const database = ensureFirebaseInitialized();
  const orderRef = database.collection('workOrders').doc();
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
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('workOrders')
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
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('workOrders')
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
  const database = ensureFirebaseInitialized();
  await database.collection('workOrders').doc(id).update({
    ...updates,
    updatedAt: new Date(),
  });
}

export async function getWorkOrderById(id: string): Promise<WorkOrder | null> {
  const database = ensureFirebaseInitialized();
  const doc = await database.collection('workOrders').doc(id).get();
  if (!doc.exists) return null;
  
  const data = doc.data();
  return {
    ...data,
    createdAt: data!.createdAt.toDate(),
    updatedAt: data!.updatedAt.toDate(),
  } as WorkOrder;
}