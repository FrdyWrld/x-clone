import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'
import { Loading } from '../ui/components/Loading'

// Wraps private routes: without a session, redirects to /login
export const ProtectedRoute = () => {
  const { logged, checking } = useAuth()
  if (checking) return <Loading />
  return logged ? <Outlet /> : <Navigate to="/login" replace />
}
