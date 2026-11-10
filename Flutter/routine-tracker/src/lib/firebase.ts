import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export function isFirebaseConfigured() {
  return Boolean(config.apiKey && config.projectId && config.appId);
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getDb() {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = initializeApp(config);
    db = getFirestore(app);
  }
  return db;
}

/** Shared household document id — both of you use the same day docs under this */
export const HOUSEHOLD_ID = (import.meta.env.VITE_HOUSEHOLD_ID as string) || 'chaithu-sujesh';
