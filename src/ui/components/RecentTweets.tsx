import { useEffect, useState } from 'react'
import { getRecentTweets } from '../../firebase/tweets'
import { paginate } from '../../helpers/paginate'
import { TweetCard } from './TweetCard'
import { Pagination } from './Pagination'
import { Loading } from './Loading'
import type { Tweet } from '../../types/social'

interface Props {
  max?: number // tweets shown when not paginated
  paginated?: boolean // up to 50 recent tweets, 10 per page
  showTitle?: boolean
}

// Latest tweets of the whole community
export const RecentTweets = ({ max = 10, paginated = false, showTitle = true }: Props) => {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [page, setPage] = useState(1)

  const fetchCount = paginated ? 50 : max

  useEffect(() => {
    let cancelled = false
    getRecentTweets(fetchCount)
      .then((list) => {
        if (!cancelled) setTweets(list)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [fetchCount])

  if (!loaded) return <Loading />
  if (failed) return <div className="alert alert-danger py-2 mb-0">No se pudieron cargar los tweets.</div>
  if (tweets.length === 0) {
    return paginated ? (
      <p className="text-muted text-center py-4 mb-0">Todavía no hay tweets en la comunidad.</p>
    ) : null
  }

  const result = paginate(tweets, page)
  const shown = paginated ? result.items : tweets

  return (
    <section className="d-flex flex-column gap-3">
      {showTitle && <h2 className="h6 fw-semibold mb-0">Tweets recientes de la comunidad</h2>}
      {shown.map((t) => (
        <TweetCard
          key={t.id}
          tweet={t}
          author={{ fullName: t.authorFullName, username: t.authorUsername }}
        />
      ))}
      {paginated && (
        <div className="d-flex justify-content-center">
          <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />
        </div>
      )}
    </section>
  )
}
