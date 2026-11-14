import { useEffect, useReducer, useRef, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { authReducer, initialAuthState } from '../reducers/AuthReducer'
import {
  fetchProfile,
  loginWithUsername,
  logoutUser,
  onAuthChange,
  registerUser,
  signInWithGoogle,
  type RegisterData,
} from '../../firebase/providers'
import type { AuthUser } from '../types/AuthReducerInterfaces'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)
  // While login/register is running, those functions update the state themselves
  const busy = useRef(false)

  // Firebase keeps the session, so we only listen to it (no localStorage needed)
  useEffect(() => {
    return onAuthChange(async (uid) => {
      if (busy.current) return
      if (!uid) {
        dispatch({ type: 'logout' })
        return
      }
      try {
        const profile = await fetchProfile(uid)
        if (profile) {
          dispatch({ type: 'login', payload: profile })
        } else {
          await logoutUser()
          dispatch({ type: 'logout' })
        }
      } catch {
        dispatch({ type: 'logout' })
      }
    })
  }, [])

  const run = async (action: () => Promise<AuthUser>) => {
    busy.current = true
    try {
      dispatch({ type: 'login', payload: await action() })
    } finally {
      busy.current = false
    }
  }

  const login = (username: string, password: string) => run(() => loginWithUsername(username, password))
  const register = (data: RegisterData) => run(() => registerUser(data))
  const loginWithGoogle = () => run(() => signInWithGoogle())
  const logout = async () => {
    await logoutUser()
    dispatch({ type: 'logout' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
