export interface AuthUser {
  id: number
  fullName: string
  username: string
  email: string
}

export interface AuthState {
  logged: boolean
  user: AuthUser | null
}

export type AuthAction =
  | { type: 'login'; payload: AuthUser }
  | { type: 'logout' }
