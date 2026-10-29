import { useState } from 'react'
import { useAuth } from '../auth/contexts/useAuth'
import { useSocial } from '../social/useSocial'
import { users } from '../data/mockData'
import { paginate } from '../helpers/paginate'
import { TweetCard } from '../ui/components/TweetCard'
import { Pagination } from '../ui/components/Pagination'

export const FeedPage = () => {
  const { user } = useAuth()
  const { tweets, followingIds } = useSocial()
  const [page, setPage] = useState(1)

  const visibleTweets = tweets
    .filter((t) => t.userId === user!.id || followingIds.includes(t.userId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const result = paginate(visibleTweets, page)

  const authorOf = (userId: number) =>
    userId === user!.id ? user! : users.find((u) => u.id === userId)

  return (
    <section className="container py-4" style={{ maxWidth: 640 }}>
      <header className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
        <h1 className="h4 fw-bold mb-0">Feed</h1>
        <span className="badge text-bg-primary rounded-pill">
          {visibleTweets.length} {visibleTweets.length === 1 ? 'tweet' : 'tweets'}
        </span>
      </header>

      {result.items.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-chat-square-text display-4 d-block mb-3"></i>
          <p className="mb-0">Todavía no hay tweets. ¡Publica uno o sigue a otros usuarios!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {result.items.map((t) => (
            <TweetCard key={t.id} tweet={t} author={authorOf(t.userId)} />
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