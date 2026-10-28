import { createContext } from 'react'
import type { AuthState } from '../types/AuthReducerInterfaces'

export interface RegisterData {
  fullName: string
  username: string
  email: string
  password: string
}

export interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => boolean
  register: (data: RegisterData) => void
  loginWithGoogle: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
