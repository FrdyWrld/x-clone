import { createContext } from 'react'
import type { RegisterData } from '../../firebase/providers'
import type { AuthState } from '../types/AuthReducerInterfaces'

export type { RegisterData }

export interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
