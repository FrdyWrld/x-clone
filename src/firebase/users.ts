import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type DocumentData,
} from 'firebase/firestore'
import { db } from './config'
import { UsernameTakenError } from './errors'
import { chunk } from '../helpers/chunk'
import { normalizeUsername } from '../helpers/normalizeUsername'
import type { UserProfile } from '../types/social'

// "@Juan Pérez" -> "juan_perez"
export const usernameKey = (username: string) => normalizeUsername(username.trim().replace(/^@/, ''))

const toProfile = (id: string, data: DocumentData): UserProfile => ({
  id,
  fullName: data.fullName,
  username: data.username,
  email: data.email,
})

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? toProfile(snap.id, snap.data()) : null
}

// usernames/{key} maps a username to its owner: it enforces uniqueness and allows login by username
export async function getUsernameEntry(username: string): Promise<{ uid: string; email: string } | null> {
  const snap = await getDoc(doc(db, 'usernames', usernameKey(username)))
  return snap.exists() ? (snap.data() as { uid: string; email: string }) : null
}

export async function getProfileByUsername(username: string): Promise<UserProfile | null> {
  const entry = await getUsernameEntry(username)
  return entry ? getProfile(entry.uid) : null
}

export async function getProfiles(ids: string[]): Promise<UserProfile[]> {
  const unique = [...new Set(ids)]
  const groups = await Promise.all(
    chunk(unique, 30).map(async (part) => {
      const snap = await getDocs(query(collection(db, 'users'), where(documentId(), 'in', part)))
      return snap.docs.map((d) => toProfile(d.id, d.data()))
    }),
  )
  return groups.flat()
}

// Newest accounts first: the source of the "suggested users" section
export async function getRecentUsers(max = 30): Promise<UserProfile[]> {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(max)))
  return snap.docs.map((d) => toProfile(d.id, d.data()))
}

interface NewProfile {
  uid: string
  fullName: string
  username: string
  email: string
}

// Reserves the username and creates the profile in a single transaction
export async function createProfile({ uid, fullName, username, email }: NewProfile): Promise<UserProfile> {
  const key = usernameKey(username)
  await runTransaction(db, async (tx) => {
    const usernameRef = doc(db, 'usernames', key)
    if ((await tx.get(usernameRef)).exists()) throw new UsernameTakenError()
    tx.set(usernameRef, { uid, email })
    tx.set(doc(db, 'users', uid), { fullName, username: key, email, createdAt: serverTimestamp() })
  })
  return { id: uid, fullName, username: key, email }
}
