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
let db= null;

const initializeFirebase = () => {
  if (!hasFirebaseCredentials()) {
    console.warn('Firebase credentials not found. Skipping Firebase initialization.');
    return null;
  }

  if (!getApps().length) {
    try {
      initializeApp({
        credential,
          clientEmail,
          privateKey, '\n'),
        }),
      });
    } catch (error) {
      console.error('Failed to initialize Firebase, error);
      return null;
    }
  }

  return getFirestore();
};

// Initialize database connection
db = initializeFirebase();

// Data types

// Helper function to check if Firebase is available
function ensureFirebaseInitialized() {
  if (!db) {
    throw new Error('Firebase is not initialized. Please check your environment variables.');
  }
  return db;
}

// User operations
export async function createUser(userData, 'id' | 'createdAt'>)> {
  const database = ensureFirebaseInitialized();
  const userRef = database.collection('users').doc();
  const user= {
    ...userData,
    id,
    createdAt),
  };
  
  await userRef.set(user);
  return user;
}

export async function getUserByEmail(email)> {
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('users').where('email', '==', email).get();
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() ;
}

export async function getUserById(id)> {
  const database = ensureFirebaseInitialized();
  const doc = await database.collection('users').doc(id).get();
  if (!doc.exists) return null;
  
  return doc.data() ;
}

export async function getWorkersByOrganization(organizationId)> {
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('users')
    .where('organizationId', '==', organizationId)
    .where('role', '==', 'FIELD_WORKER')
    .get();
  
  return snapshot.docs.map((doc) => doc.data() );
}

// Organization operations
export async function createOrganization(name)> {
  const database = ensureFirebaseInitialized();
  const orgRef = database.collection('organizations').doc();
  const organization= {
    id,
    name,
    createdAt),
  };
  
  await orgRef.set(organization);
  return organization;
}

export async function getOrganizationByName(name)> {
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('organizations').where('name', '==', name).get();
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() ;
}

// Work Order operations
export async function createWorkOrder(orderData, 'id' | 'createdAt' | 'updatedAt'>)> {
  const database = ensureFirebaseInitialized();
  const orderRef = database.collection('workOrders').doc();
  const workOrder= {
    ...orderData,
    id,
    createdAt),
    updatedAt),
  };
  
  await orderRef.set(workOrder);
  return workOrder;
}

export async function getWorkOrdersByOrganization(organizationId)> {
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('workOrders')
    .where('organizationId', '==', organizationId)
    .orderBy('createdAt', 'desc')
    .get();
  
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    createdAt).createdAt.toDate(),
    updatedAt).updatedAt.toDate(),
  } ));
}

export async function getWorkOrdersByAssignedUser(userId, organizationId)> {
  const database = ensureFirebaseInitialized();
  const snapshot = await database.collection('workOrders')
    .where('organizationId', '==', organizationId)
    .where('assignedUserId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    createdAt).createdAt.toDate(),
    updatedAt).updatedAt.toDate(),
  } ));
}

export async function updateWorkOrder(id, updates, 'id' | 'createdAt'>>)> {
  const database = ensureFirebaseInitialized();
  await database.collection('workOrders').doc(id).update({
    ...updates,
    updatedAt),
  });
}

export async function getWorkOrderById(id)> {
  const database = ensureFirebaseInitialized();
  const doc = await database.collection('workOrders').doc(id).get();
  if (!doc.exists) return null;
  
  const data = doc.data();
  return {
    ...data,
    createdAt),
    updatedAt),
  } ;
}