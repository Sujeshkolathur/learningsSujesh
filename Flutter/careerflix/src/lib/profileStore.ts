import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { sujeshSeed } from '../data/seedSujesh'
import type { CareerUser } from '../types/auth'
import { isStaff } from '../types/auth'
import type { CareerProfile, ProfileDraft } from '../types/profile'
import { getDb, isFirebaseConfigured } from './firebase'

const LOCAL_KEY = 'careerflix.profiles'

function nowIso() {
  return new Date().toISOString()
}

function readLocal(): CareerProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? (JSON.parse(raw) as CareerProfile[]) : []
  } catch {
    return []
  }
}

function writeLocal(profiles: CareerProfile[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(profiles))
}

function toProfile(
  id: string,
  draft: ProfileDraft,
  ownerUid: string,
  createdAt?: string,
): CareerProfile {
  const stamp = nowIso()
  return {
    id,
    ownerUid,
    ...draft,
    createdAt: createdAt ?? stamp,
    updatedAt: stamp,
  }
}

function sortProfiles(profiles: CareerProfile[]) {
  return [...profiles].sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export async function listProfilesForUser(user: CareerUser): Promise<CareerProfile[]> {
  const db = getDb()

  if (db) {
    if (isStaff(user.role)) {
      const snap = await getDocs(collection(db, 'careerProfiles'))
      return sortProfiles(snap.docs.map((d) => ({ ...(d.data() as CareerProfile), id: d.id })))
    }

    const q = query(collection(db, 'careerProfiles'), where('ownerUid', '==', user.uid))
    const snap = await getDocs(q)
    return sortProfiles(snap.docs.map((d) => ({ ...(d.data() as CareerProfile), id: d.id })))
  }

  const all = readLocal()
  if (isStaff(user.role)) return sortProfiles(all)
  return sortProfiles(all.filter((p) => p.ownerUid === user.uid))
}

export async function getProfile(id: string): Promise<CareerProfile | null> {
  const db = getDb()
  if (db) {
    const snap = await getDoc(doc(db, 'careerProfiles', id))
    if (!snap.exists()) return null
    return { ...(snap.data() as CareerProfile), id: snap.id }
  }
  return readLocal().find((p) => p.id === id) ?? null
}

export async function saveProfile(profile: CareerProfile): Promise<CareerProfile> {
  const next = { ...profile, updatedAt: nowIso() }
  const db = getDb()
  if (db) {
    await setDoc(doc(db, 'careerProfiles', next.id), next)
  }

  const all = readLocal()
  const idx = all.findIndex((p) => p.id === next.id)
  if (idx >= 0) all[idx] = next
  else all.push(next)
  writeLocal(all)
  return next
}

export async function createProfileForUser(
  user: CareerUser,
  draft: ProfileDraft,
): Promise<CareerProfile> {
  const existing = await listProfilesForUser({ ...user, role: 'candidate' })
  if (user.role === 'candidate' && existing.length > 0) {
    throw new Error('You already have a career profile. Edit it instead of creating another.')
  }

  const id = user.role === 'candidate' ? `profile_${user.uid}` : `profile_${crypto.randomUUID().slice(0, 8)}`
  const profile = toProfile(id, draft, user.uid)
  return saveProfile(profile)
}

export async function removeProfile(id: string): Promise<void> {
  const db = getDb()
  if (db) {
    await deleteDoc(doc(db, 'careerProfiles', id))
  }
  writeLocal(readLocal().filter((p) => p.id !== id))
}

export async function createDemoResumeProfile(user: CareerUser): Promise<CareerProfile> {
  return createProfileForUser(user, {
    ...sujeshSeed,
    displayName: user.displayName || sujeshSeed.displayName,
    email: user.email || sujeshSeed.email,
  })
}

export function storageModeLabel() {
  return isFirebaseConfigured() ? 'Firebase' : 'Local browser storage'
}

export function canEditProfile(user: CareerUser, profile: CareerProfile) {
  return user.role === 'admin' || profile.ownerUid === user.uid
}

export function canDeleteProfile(user: CareerUser, profile: CareerProfile) {
  return user.role === 'admin' || profile.ownerUid === user.uid
}
