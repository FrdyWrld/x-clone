import type { UserProfile } from '../../types/social'

export type AuthUser = UserProfile

export interface AuthState {
  checking: boolean // true until Firebase says whether there is a session
  logged: boolean
  user: AuthUser | null
}

export type AuthAction = { type: 'login'; payload: AuthUser } | { type: 'logout' }
