import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import type { CareerUser, UserRole } from '../types/auth'
import {
  ADMIN_EMAILS,
  HIRING_MANAGER_EMAILS,
  getDb,
  getFirebaseAuth,
  isFirebaseConfigured,
} from './firebase'

const LOCAL_SESSION_KEY = 'careerflix.session'
const LOCAL_USERS_KEY = 'careerflix.users'

function nowIso() {
  return new Date().toISOString()
}

function resolveRole(email: string): UserRole {
  const normalized = email.trim().toLowerCase()
  if (ADMIN_EMAILS.includes(normalized)) return 'admin'
  if (HIRING_MANAGER_EMAILS.includes(normalized)) return 'hiring_manager'
  return 'candidate'
}

function readLocalUsers(): CareerUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY)
    return raw ? (JSON.parse(raw) as CareerUser[]) : []
  } catch {
    return []
  }
}

function writeLocalUsers(users: CareerUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

function readLocalSession(): CareerUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY)
    return raw ? (JSON.parse(raw) as CareerUser) : null
  } catch {
    return null
  }
}

function writeLocalSession(user: CareerUser | null) {
  if (!user) localStorage.removeItem(LOCAL_SESSION_KEY)
  else localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user))
}

async function ensureRolesConfig(email: string, role: UserRole) {
  const db = getDb()
  if (!db) return
  const ref = doc(db, 'careerConfig', 'roles')
  const snap = await getDoc(ref)
  if (snap.exists()) return

  if (role !== 'admin') return

  await setDoc(ref, {
    admins: [email.toLowerCase(), ...ADMIN_EMAILS],
    hiringManagers: [...HIRING_MANAGER_EMAILS],
    bootstrappedBy: email.toLowerCase(),
    bootstrappedAt: nowIso(),
  })
}

async function upsertRemoteUser(firebaseUser: User, preferredName?: string): Promise<CareerUser> {
  const db = getDb()
  if (!db) throw new Error('Firebase is not configured')

  const email = (firebaseUser.email ?? '').toLowerCase()
  const ref = doc(db, 'careerUsers', firebaseUser.uid)
  const existing = await getDoc(ref)
  if (existing.exists()) {
    return existing.data() as CareerUser
  }

  const role = resolveRole(email)
  // Admins must bootstrap careerConfig/roles before their user doc can be created
  if (role === 'admin') {
    await ensureRolesConfig(email, role)
  } else if (role === 'hiring_manager') {
    const rolesSnap = await getDoc(doc(db, 'careerConfig', 'roles'))
    if (!rolesSnap.exists()) {
      throw new Error(
        'Hiring manager signup is not ready yet. An admin must sign up first to bootstrap staff roles.',
      )
    }
  }

  const user: CareerUser = {
    uid: firebaseUser.uid,
    email,
    displayName: preferredName?.trim() || firebaseUser.displayName || email.split('@')[0],
    role,
    createdAt: nowIso(),
  }
  await setDoc(ref, user)
  return user
}

export function watchAuth(callback: (user: CareerUser | null) => void) {
  if (!isFirebaseConfigured()) {
    callback(readLocalSession())
    return () => undefined
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    callback(null)
    return () => undefined
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null)
      return
    }
    try {
      const user = await upsertRemoteUser(firebaseUser)
      callback(user)
    } catch (err) {
      console.error(err)
      callback(null)
    }
  })
}

export async function signUp(email: string, password: string, displayName: string) {
  const normalized = email.trim().toLowerCase()
  if (!isFirebaseConfigured()) {
    const users = readLocalUsers()
    if (users.some((u) => u.email === normalized)) {
      throw new Error('An account with this email already exists')
    }
    const user: CareerUser = {
      uid: `local_${crypto.randomUUID().slice(0, 8)}`,
      email: normalized,
      displayName: displayName.trim() || normalized.split('@')[0],
      role: resolveRole(normalized),
      createdAt: nowIso(),
    }
    writeLocalUsers([...users, user])
    writeLocalSession(user)
    return user
  }

  const auth = getFirebaseAuth()
  if (!auth) throw new Error('Auth is unavailable')
  const cred = await createUserWithEmailAndPassword(auth, normalized, password)
  if (displayName.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() })
  }
  return upsertRemoteUser(cred.user, displayName)
}

export async function signIn(email: string, password: string) {
  const normalized = email.trim().toLowerCase()
  if (!isFirebaseConfigured()) {
    const users = readLocalUsers()
    const user = users.find((u) => u.email === normalized)
    if (!user) throw new Error('No local account found. Sign up first.')
    // Local demo: password is not verified cryptographically; require non-empty
    if (!password) throw new Error('Password is required')
    writeLocalSession(user)
    return user
  }

  const auth = getFirebaseAuth()
  if (!auth) throw new Error('Auth is unavailable')
  const cred = await signInWithEmailAndPassword(auth, normalized, password)
  return upsertRemoteUser(cred.user)
}

export async function logOut() {
  if (!isFirebaseConfigured()) {
    writeLocalSession(null)
    return
  }
  const auth = getFirebaseAuth()
  if (auth) await signOut(auth)
}

export async function listUsersForAdmin(): Promise<CareerUser[]> {
  if (!isFirebaseConfigured()) {
    return readLocalUsers().sort((a, b) => a.email.localeCompare(b.email))
  }
  const db = getDb()
  if (!db) return []
  const snap = await getDocs(collection(db, 'careerUsers'))
  return snap.docs
    .map((d) => d.data() as CareerUser)
    .sort((a, b) => a.email.localeCompare(b.email))
}

export async function updateUserRole(uid: string, role: UserRole) {
  if (!isFirebaseConfigured()) {
    const users = readLocalUsers().map((u) => (u.uid === uid ? { ...u, role } : u))
    writeLocalUsers(users)
    const session = readLocalSession()
    if (session?.uid === uid) writeLocalSession({ ...session, role })
    return
  }
  const db = getDb()
  if (!db) throw new Error('Firebase is not configured')
  const ref = doc(db, 'careerUsers', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('User not found')
  const current = snap.data() as CareerUser
  await setDoc(ref, { ...current, role })
}
