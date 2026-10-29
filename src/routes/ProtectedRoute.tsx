import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'

// Wraps private routes: without a session, redirects to /login
export const ProtectedRoute = () => {
  const { logged } = useAuth()
  return logged ? <Outlet /> : <Navigate to="/login" replace />
}
