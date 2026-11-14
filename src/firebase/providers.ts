import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth } from './config'
import { AppError, UsernameTakenError } from './errors'
import { createProfile, getProfile, getUsernameEntry, usernameKey } from './users'
import { USERNAME_HELP, USERNAME_REGEX } from '../helpers/validators'
import type { UserProfile } from '../types/social'

export interface RegisterData {
  fullName: string
  username: string
  email: string
  password: string
}

export const fetchProfile = getProfile

export const onAuthChange = (callback: (uid: string | null) => void) =>
  onAuthStateChanged(auth, (user) => callback(user?.uid ?? null))

export async function registerUser(data: RegisterData): Promise<UserProfile> {
  const fullName = data.fullName.trim()
  const username = usernameKey(data.username)
  const email = data.email.trim().toLowerCase()

  if (!fullName) throw new AppError('Escribe tu nombre completo.')
  if (!USERNAME_REGEX.test(username)) throw new AppError(USERNAME_HELP)

  // The username must be free (Firebase Auth rejects a repeated email by itself)
  if (await getUsernameEntry(username)) throw new UsernameTakenError()

  const credential = await createUserWithEmailAndPassword(auth, email, data.password)
  try {
    return await createProfile({ uid: credential.user.uid, fullName, username, email })
  } catch (error) {
    // Don't leave an account without a profile behind
    await deleteUser(credential.user).catch(() => undefined)
    throw error
  }
}

export async function loginWithUsername(username: string, password: string): Promise<UserProfile> {
  const entry = await getUsernameEntry(username)
  if (!entry) throw new AppError('Usuario o contraseña incorrectos.')

  const credential = await signInWithEmailAndPassword(auth, entry.email, password)
  const profile = await getProfile(credential.user.uid)
  if (!profile) {
    await signOut(auth)
    throw new AppError('Tu cuenta no tiene un perfil asociado.')
  }
  return profile
}

const baseUsername = (email: string) => {
  const base = usernameKey(email.split('@')[0]).replace(/[^a-z0-9_]/g, '').slice(0, 16)
  return base.length >= 3 ? base : 'user'
}

export async function signInWithGoogle(): Promise<UserProfile> {
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider())

  const existing = await getProfile(user.uid)
  if (existing) return existing

  // First time with Google: create a profile with an available username
  const email = (user.email ?? '').toLowerCase()
  const base = baseUsername(email)
  const fullName = user.displayName?.trim() || base

  for (let attempt = 0; attempt < 10; attempt++) {
    const username = attempt === 0 ? base : `${base}${Math.floor(100 + Math.random() * 900)}`
    try {
      return await createProfile({ uid: user.uid, fullName, username, email })
    } catch (error) {
      if (!(error instanceof UsernameTakenError)) throw error
    }
  }
  throw new AppError('No se pudo asignar un nombre de usuario. Inténtalo de nuevo.')
}

export const logoutUser = () => signOut(auth)
