import { Link } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'
import { useSocial } from '../social/useSocial'

export const HomePage = () => {
  const { user } = useAuth()
  const { getCounts } = useSocial()
  const counts = getCounts(user!.id)

  return (
    <section className="container py-4" style={{ maxWidth: 640 }}>
      <header className="border-bottom pb-3 mb-4">
        <h1 className="h4 fw-bold mb-1">Hola, {user?.fullName}</h1>
        <span className="text-muted">@{user?.username}</span>
      </header>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row text-center">
            <div className="col-6 border-end">
              <Link to="/followers" className="text-decoration-none text-reset d-block">
                <div className="h3 fw-bold mb-0">{counts.followers}</div>
                <div className="text-muted small">Seguidores</div>
              </Link>
            </div>
            <div className="col-6">
              <Link to="/following" className="text-decoration-none text-reset d-block">
                <div className="h3 fw-bold mb-0">{counts.following}</div>
                <div className="text-muted small">Seguidos</div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="d-grid mb-4">
        <Link to="/compose" className="btn btn-primary btn-lg rounded-pill">
          <i className="bi bi-pencil-square me-2"></i>
          Tweet
        </Link>
      </div>

      <div className="list-group shadow-sm">
        <Link to="/feed" className="list-group-item list-group-item-action d-flex align-items-center">
          <i className="bi bi-house-door me-3"></i>
          Ver mi feed
          <i className="bi bi-chevron-right ms-auto text-muted"></i>
        </Link>
        <Link
          to={`/users/${user?.username}`}
          className="list-group-item list-group-item-action d-flex align-items-center"
        >
          <i className="bi bi-person me-3"></i>
          Ver mis tweets
          <i className="bi bi-chevron-right ms-auto text-muted"></i>
        </Link>
      </div>
    </section>
  )
}