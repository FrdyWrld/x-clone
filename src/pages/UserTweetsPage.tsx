import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'
import { useSocial } from '../social/useSocial'
import { users } from '../data/mockData'
import { paginate } from '../helpers/paginate'
import { TweetCard } from '../ui/components/TweetCard'
import { Pagination } from '../ui/components/Pagination'

const UserTweets = ({ username }: { username: string }) => {
  const { user: me } = useAuth()
  const { tweets, getCounts, isFollowing, follow } = useSocial()
  const [page, setPage] = useState(1)

  const profile = me && me.username === username ? me : users.find((u) => u.username === username)

  if (!profile) {
    return (
      <section className="container py-4" style={{ maxWidth: 640 }}>
        <div className="alert alert-warning d-flex align-items-center mb-0" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          El usuario @{username} no existe.
        </div>
      </section>
    )
  }

  const counts = getCounts(profile.id)
  const userTweets = tweets
    .filter((t) => t.userId === profile.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const result = paginate(userTweets, page)
  const isMe = profile.id === me?.id

  return (
    <section className="container py-4" style={{ maxWidth: 640 }}>
      <header className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-3 flex-shrink-0"
              style={{ width: 64, height: 64 }}
              aria-hidden="true"
            >
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow-1">
              <h1 className="h4 fw-bold mb-0">{profile.fullName}</h1>
              <span className="text-muted">@{profile.username}</span>
            </div>
            {!isMe && !isFollowing(profile.id) && (
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={() => follow(profile.id)}
              >
                Seguir
              </button>
            )}
          </div>

          <div className="d-flex gap-4 mt-3">
            <span>
              <strong>{counts.followers}</strong> <span className="text-muted">Seguidores</span>
            </span>
            <span>
              <strong>{counts.following}</strong> <span className="text-muted">Seguidos</span>
            </span>
          </div>
        </div>
      </header>

      {result.total === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-chat-square-text display-4 d-block mb-3"></i>
          <p className="mb-0">Aún no hay tweets.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {result.items.map((t) => (
           <TweetCard key={t.id} tweet={t} author={profile} />
          ))}
        </div>
      )}

      {result.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />
        </div>
      )}
    </section>
  )
}

export const UserTweetsPage = () => {
  const { username = '' } = useParams()
  return <UserTweets key={username} username={username} />
}