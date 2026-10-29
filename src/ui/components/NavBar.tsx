import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/contexts/useAuth'

export const NavBar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar bg-body border-bottom sticky-top">
      <div className="container" style={{ maxWidth: 640 }}>
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <i className="bi bi-twitter-x me-2"></i>
          X Clone
        </Link>

        {user && (
          <div className="d-flex align-items-center gap-3">
            <Link
              to={`/users/${user.username}`}
              className="text-decoration-none text-reset fw-semibold"
            >
              @{user.username}
            </Link>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill"
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}