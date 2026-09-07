import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * Firebase is used only for lightweight account identity (email/password),
 * so the Researcher Workspace can namespace saved experiment history per
 * user. It is not required to use the core interactive experiment: the
 * recall lab, the accuracy benchmark, and the BDH-CQ / limitations
 * content are all fully public and reachable without signing in. See
 * README.md, "Public access" section.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app = null
let auth = null
let db = null

if (hasFirebaseConfig) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
}

// isFirebaseConfigured is the name services/experimentStorage.js imports;
// hasFirebaseConfig is kept too since other call sites already use it.
const isFirebaseConfigured = hasFirebaseConfig

export { app, auth, db, hasFirebaseConfig, isFirebaseConfigured }
