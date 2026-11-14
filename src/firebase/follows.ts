import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import { AppError } from './errors'
import { getProfile, getProfileByUsername, usernameKey } from './users'
import type { UserProfile } from '../types/social'

const follows = () => collection(db, 'follows')
const followDocId = (followerId: string, followedId: string) => `${followerId}_${followedId}`

// Live list of the ids that `uid` follows
export const listenFollowing = (uid: string, onChange: (ids: string[]) => void): Unsubscribe =>
  onSnapshot(
    query(follows(), where('followerId', '==', uid)),
    (snap) => onChange(snap.docs.map((d) => d.data().followedId as string)),
    () => onChange([]),
  )

// Live list of the ids that follow `uid`
export const listenFollowers = (uid: string, onChange: (ids: string[]) => void): Unsubscribe =>
  onSnapshot(
    query(follows(), where('followedId', '==', uid)),
    (snap) => onChange(snap.docs.map((d) => d.data().followerId as string)),
    () => onChange([]),
  )

// One-time reads, used to show the lists of any user (not only the logged-in one)
export async function getFollowerIds(uid: string): Promise<string[]> {
  const snap = await getDocs(query(follows(), where('followedId', '==', uid)))
  return snap.docs.map((d) => d.data().followerId as string)
}

export async function getFollowingIds(uid: string): Promise<string[]> {
  const snap = await getDocs(query(follows(), where('followerId', '==', uid)))
  return snap.docs.map((d) => d.data().followedId as string)
}

export async function getFollowCounts(uid: string) {
  const [followers, following] = await Promise.all([
    getCountFromServer(query(follows(), where('followedId', '==', uid))),
    getCountFromServer(query(follows(), where('followerId', '==', uid))),
  ])
  return { followers: followers.data().count, following: following.data().count }
}

async function createFollow(meId: string, target: UserProfile) {
  if (target.id === meId) throw new AppError('No puedes seguirte a ti mismo.')
  const ref = doc(db, 'follows', followDocId(meId, target.id))
  if ((await getDoc(ref)).exists()) throw new AppError(`Ya sigues a @${target.username}.`)
  await setDoc(ref, { followerId: meId, followedId: target.id, createdAt: serverTimestamp() })
}

export async function followByUsername(meId: string, username: string): Promise<UserProfile> {
  const clean = usernameKey(username)
  if (!clean) throw new AppError('Escribe un nombre de usuario.')
  const target = await getProfileByUsername(clean)
  if (!target) throw new AppError(`No existe el usuario @${clean}.`)
  await createFollow(meId, target)
  return target
}

export async function followById(meId: string, targetId: string): Promise<UserProfile> {
  const target = await getProfile(targetId)
  if (!target) throw new AppError('El usuario no existe.')
  await createFollow(meId, target)
  return target
}
