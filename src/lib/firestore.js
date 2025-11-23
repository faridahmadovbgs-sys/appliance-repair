// Simplified Firestore module with build-time fallback support
let firestoreModule= null;

// Check if we're in a build environment or missing credentials
const isFirebaseAvailable = () => {
  // During build time, skip file checks
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return false;
  }

  // Check Downloads folder for convenience (development only)
  if (process.env.NODE_ENV === 'development') {
    try {
      const os = require('os');
      const path = require('path');
      const fs = require('fs');
      const downloadsPath = path.join(os.homedir(), 'Downloads');
      const files = fs.readdirSync(downloadsPath);
      const serviceAccountFile = files.find((f) => f.includes('contractor-aspp') && f.endsWith('.json'));
      if (serviceAccountFile) {
        console.log('Found service account in Downloads, serviceAccountFile);
        return true;
      }
    } catch {}
  }
  
  // Fall back to environment variables (production)
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    typeof window === 'undefined' // Server-side only
  );
};

// Check if we should use demo mode
const useDemoMode = process.env.NEXT_PUBLIC_USE_DEMO_MODE === 'true' || !isFirebaseAvailable();

console.log('Firestore, useDemoMode);
console.log('Firestore, isFirebaseAvailable());
console.log('Firestore, {
  hasProjectId,
  hasClientEmail,
  hasPrivateKey,
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
        // Try to load from service account JSON file first (development only)
        let serviceAccount = null;
        
        if (process.env.NODE_ENV === 'development') {
          try {
            const os = require('os');
            const path = require('path');
            const fs = require('fs');
            const downloadsPath = path.join(os.homedir(), 'Downloads');
            const files = fs.readdirSync(downloadsPath);
            const serviceAccountFile = files.find((f) => f.includes('contractor-aspp') && f.endsWith('.json'));
            if (serviceAccountFile) {
              const filePath = path.join(downloadsPath, serviceAccountFile);
              serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
              console.log('Loaded service account from Downloads folder');
            }
          } catch (dlError) {
            console.log('Could not load from Downloads, dlError);
          }
        }
        
        if (serviceAccount) {
          initializeApp({
            credential)
          });
        } else {
          // Fall back to environment variables (production)
          initializeApp({
            credential,
              clientEmail,
              privateKey, '\n'),
            }),
          });
        }
      }

      firestoreModule = getFirestore();
    } catch (error) {
      console.error('Failed to initialize Firebase, error);
      return null;
    }
  }

  return firestoreModule;
};

// Data types

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
export async function createUser(userData, 'id' | 'createdAt'>)> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.createUser(userData);
  }
  
  const db = await ensureFirestore();
  const userRef = db.collection('users').doc();
  const user= {
    ...userData,
    id,
    createdAt),
  };
  
  await userRef.set(user);
  return user;
}

export async function getUserByEmail(email)> {
  if (useDemoMode) {
    console.log('Firestore);
    const demo = await import('./firestore-demo');
    return demo.getUserByEmail(email);
  }
  
  console.log('Firestore);
  const db = await ensureFirestore();
  const snapshot = await db.collection('users').where('email', '==', email).get();
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() ;
}

export async function getUserById(id)> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getUserById(id);
  }
  
  const db = await ensureFirestore();
  const doc = await db.collection('users').doc(id).get();
  if (!doc.exists) return null;
  
  return doc.data() ;
}

export async function getWorkersByOrganization(organizationId)> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getWorkersByOrganization(organizationId);
  }
  
  const db = await ensureFirestore();
  const snapshot = await db.collection('users')
    .where('organizationId', '==', organizationId)
    .where('role', '==', 'FIELD_WORKER')
    .get();
  
  return snapshot.docs.map((doc) => doc.data() );
}

// Organization operations
export async function createOrganization(name)> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.createOrganization(name);
  }
  
  const db = await ensureFirestore();
  const orgRef = db.collection('organizations').doc();
  const organization= {
    id,
    name,
    createdAt),
  };
  
  await orgRef.set(organization);
  return organization;
}

export async function getOrganizationByName(name)> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getOrganizationByName(name);
  }
  
  const db = await ensureFirestore();
  const snapshot = await db.collection('organizations').where('name', '==', name).get();
  if (snapshot.empty) return null;
  
  return snapshot.docs[0].data() ;
}

// Work Order operations
export async function createWorkOrder(orderData, 'id' | 'createdAt' | 'updatedAt'>)> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.createWorkOrder(orderData);
  }
  
  const db = await ensureFirestore();
  const orderRef = db.collection('workOrders').doc();
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
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.getWorkOrdersByOrganization(organizationId);
  }
  
  const db = await ensureFirestore();
  const snapshot = await db.collection('workOrders')
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
  
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    createdAt).createdAt.toDate(),
    updatedAt).updatedAt.toDate(),
  } ));
}

export async function updateWorkOrder(id, updates, 'id' | 'createdAt'>>)> {
  if (useDemoMode) {
    const demo = await import('./firestore-demo');
    return demo.updateWorkOrder(id, updates);
  }
  
  const db = await ensureFirestore();
  await db.collection('workOrders').doc(id).update({
    ...updates,
    updatedAt),
  });
}

export async function getWorkOrderById(id)> {
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
    createdAt),
    updatedAt),
  } ;
}