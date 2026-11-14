import { Link } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'
import { useSocial } from '../social/useSocial'
import { FollowForm } from '../ui/components/FollowForm'
import { SuggestedUsers } from '../ui/components/SuggestedUsers'

export const HomePage = () => {
  const { user } = useAuth()
  const { followerIds, followingIds } = useSocial()

  return (
    <section className="d-flex flex-column gap-3">
      <h1 className="h4 fw-bold mb-0">Hola, {user?.fullName}</h1>

      <div className="card shadow-sm border-0">
        <div className="card-body d-flex gap-4">
          <Link to="/followers" className="text-decoration-none text-reset">
            <strong>{followerIds.length}</strong> <span className="text-muted">Seguidores</span>
          </Link>
          <Link to="/following" className="text-decoration-none text-reset">
            <strong>{followingIds.length}</strong> <span className="text-muted">Seguidos</span>
          </Link>
        </div>
      </div>

      <div className="d-grid">
        <Link to="/compose" className="btn btn-primary btn-lg rounded-pill">
          <i className="bi bi-pencil-square me-2"></i>
          Tweet
        </Link>
      </div>

      <SuggestedUsers />

      <FollowForm />

      <div className="d-flex gap-3">
        <Link to="/feed">Feed y explorar</Link>
        <Link to={`/users/${user?.username}`}>Ver mis tweets</Link>
      </div>
    </section>
  )
}
