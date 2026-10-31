import { useEffect, useReducer, type ReactNode } from 'react'
import { AuthContext, type RegisterData } from './AuthContext'
import { authReducer } from '../reducers/AuthReducer'
import type { AuthState } from '../types/AuthReducerInterfaces'
import { users } from '../../data/mockData'
import { normalizeUsername } from '../../helpers/normalizeUsername'

const KEY = 'xclone-auth'

const init = (): AuthState => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as AuthState
  } catch {
    // storage not available
  }
  return { logged: false, user: null }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, null, () => init())

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // ignore storage errors
    }
  }, [state])

  // Mock login: accepts any non-empty username and password.
  // Unknown usernames fall back to the default mock user.
  const login = (username: string, password: string) => {
    if (!username.trim() || !password.trim()) return false
    const found = users.find((u) => u.username === normalizeUsername(username))
    dispatch({ type: 'login', payload: found ?? users[0] })
    return true
  }

  const register = (data: RegisterData) => {
    dispatch({
      type: 'login',
      payload: {
        id: users[0].id,
        fullName: data.fullName.trim(),
        username: normalizeUsername(data.username),
        email: data.email.trim().toLowerCase(),
      },
    })
  }

  const loginWithGoogle = () => dispatch({ type: 'login', payload: users[0] })
  const logout = () => dispatch({ type: 'logout' })

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}