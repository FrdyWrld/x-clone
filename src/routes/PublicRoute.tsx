import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'

// Login and register: if already logged in, redirects to home
export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { logged } = useAuth()
  return logged ? <Navigate to="/" replace /> : <>{children}</>
}
