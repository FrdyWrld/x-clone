import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'
import { Loading } from '../ui/components/Loading'

// Login and register: if already logged in, redirects to home
export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { logged, checking } = useAuth()
  if (checking) return <Loading />
  return logged ? <Navigate to="/" replace /> : <>{children}</>
}
