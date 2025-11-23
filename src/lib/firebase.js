import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getMessaging, isSupported } from "firebase/messaging"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
}

// Check if Firebase is configured
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
)

// Initialize Firebase only if configured
let app= null
let db= null
let auth= null

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (error) {
    console.warn("Firebase initialization failed, error)
  }
}

export { db, auth, app }

// Initialize messaging only on client side and if supported
export const getMessagingInstance = async () => {
  if (!isFirebaseConfigured || !app) {
    return null
  }
  
  try {
    const messagingSupported = await isSupported()
    if (messagingSupported && typeof window !== "undefined") {
      return getMessaging(app)
    }
  } catch (error) {
    console.warn("Firebase messaging not supported, error)
  }
  return null
}

export const isFirebaseEnabled = isFirebaseConfigured
