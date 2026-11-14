import { useEffect, useState } from 'react'
import { useAuth } from '../auth/contexts/useAuth'
import { useSocial } from '../social/useSocial'
import { getTweetsByAuthors } from '../firebase/tweets'
import { paginate } from '../helpers/paginate'
import { TweetCard } from '../ui/components/TweetCard'
import { Pagination } from '../ui/components/Pagination'
import { Loading } from '../ui/components/Loading'
import { SuggestedUsers } from '../ui/components/SuggestedUsers'
import { RecentTweets } from '../ui/components/RecentTweets'
import type { Tweet } from '../types/social'

type Tab = 'following' | 'explore'

export const FeedPage = () => {
  const { user } = useAuth()
  const { followingIds } = useSocial()
  const [tab, setTab] = useState<Tab>('following')
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  const userId = user?.id

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    const load = async () => {
      try {
        const list = await getTweetsByAuthors([userId, ...followingIds])
        if (!cancelled) {
          setTweets(list)
          setError('')
        }
      } catch {
        if (!cancelled) setError('No se pudo cargar el feed.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId, followingIds])

  const result = paginate(tweets, page)

  return (
    <section className="d-flex flex-column gap-3">
      <h1 className="h4 fw-bold mb-0">Feed</h1>

      <ul className="nav nav-pills">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link rounded-pill ${tab === 'following' ? 'active' : ''}`}
            onClick={() => setTab('following')}
          >
            Siguiendo
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link rounded-pill ${tab === 'explore' ? 'active' : ''}`}
            onClick={() => setTab('explore')}
          >
            Explorar
          </button>
        </li>
      </ul>

      {/* Explorar: what everybody is posting */}
      {tab === 'explore' && <RecentTweets paginated showTitle={false} />}

      {tab === 'following' && (
        <>
          {loading && <Loading />}
          {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

          {/* Empty feed (for example a brand new user): suggest people and show what the community posts */}
          {!loading && !error && result.total === 0 && (
            <>
              <div className="text-center py-3">
                <p className="fw-semibold mb-1">Tu feed está vacío</p>
                <p className="text-muted mb-0">Sigue a algunas personas para ver sus tweets aquí.</p>
              </div>
              <SuggestedUsers />
              <RecentTweets />
            </>
          )}

          {result.items.map((t) => (
            <TweetCard
              key={t.id}
              tweet={t}
              author={{ fullName: t.authorFullName, username: t.authorUsername }}
            />
          ))}

          <div className="d-flex justify-content-center">
            <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </section>
  )
}
