import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

export function isFirebaseConfigured() {
  return Boolean(config.apiKey && config.projectId && config.appId)
}

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

function ensureApp() {
  if (!isFirebaseConfigured()) return null
  if (!app) {
    app = initializeApp(config)
    db = getFirestore(app)
    auth = getAuth(app)
  }
  return app
}

export function getDb() {
  ensureApp()
  return db
}

export function getFirebaseAuth() {
  ensureApp()
  return auth
}

export function parseEmailList(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export const ADMIN_EMAILS = parseEmailList(import.meta.env.VITE_ADMIN_EMAILS)
export const HIRING_MANAGER_EMAILS = parseEmailList(import.meta.env.VITE_HIRING_MANAGER_EMAILS)
