import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'
import { useSocial } from '../social/useSocial'
import { getProfileByUsername } from '../firebase/users'
import { getTweetsByAuthor } from '../firebase/tweets'
import { getFollowCounts } from '../firebase/follows'
import { toMessage } from '../firebase/errors'
import { paginate } from '../helpers/paginate'
import { TweetCard } from '../ui/components/TweetCard'
import { Pagination } from '../ui/components/Pagination'
import { Loading } from '../ui/components/Loading'
import { Notice, type NoticeState } from '../ui/components/Notice'
import type { Tweet, UserProfile } from '../types/social'

type Status = 'loading' | 'ready' | 'notfound' | 'error'

const UserTweets = ({ username }: { username: string }) => {
  const { user: me } = useAuth()
  const { ready, isFollowing, followById } = useSocial()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [counts, setCounts] = useState({ followers: 0, following: 0 })
  const [status, setStatus] = useState<Status>('loading')
  const [notice, setNotice] = useState<NoticeState | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const found = await getProfileByUsername(username)
        if (!found) {
          if (!cancelled) setStatus('notfound')
          return
        }
        const [list, followCounts] = await Promise.all([
          getTweetsByAuthor(found.id),
          getFollowCounts(found.id),
        ])
        if (cancelled) return
        setProfile(found)
        setTweets(list)
        setCounts(followCounts)
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [username])

  if (status === 'loading') return <Loading />
  if (status === 'notfound') {
    return <p className="text-muted text-center py-5">El usuario @{username} no existe.</p>
  }
  if (status === 'error' || !profile) {
    return <div className="alert alert-danger">No se pudo cargar el perfil.</div>
  }

  const isMe = profile.id === me?.id
  const result = paginate(tweets, page)
  const author = { fullName: profile.fullName, username: profile.username }

  const onFollow = async () => {
    try {
      const target = await followById(profile.id)
      setCounts((c) => ({ ...c, followers: c.followers + 1 }))
      setNotice({ type: 'success', text: `Ahora sigues a @${target.username}.` })
    } catch (e) {
      setNotice({ type: 'warning', text: toMessage(e) })
    }
  }

  return (
    <section className="d-flex flex-column gap-3">
      <div>
        <h1 className="h4 fw-bold mb-0">{profile.fullName}</h1>
        <span className="text-muted">@{profile.username}</span>
      </div>

      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="card shadow-sm border-0">
        <div className="card-body d-flex align-items-center gap-4">
          <Link to={`/users/${profile.username}/followers`} className="text-decoration-none text-reset">
            <strong>{counts.followers}</strong> <span className="text-muted">Seguidores</span>
          </Link>
          <Link to={`/users/${profile.username}/following`} className="text-decoration-none text-reset">
            <strong>{counts.following}</strong> <span className="text-muted">Seguidos</span>
          </Link>
          {ready && !isMe && !isFollowing(profile.id) && (
            <button type="button" className="btn btn-primary btn-sm rounded-pill px-3 ms-auto" onClick={onFollow}>
              Seguir
            </button>
          )}
        </div>
      </div>

      {result.total === 0 && <p className="text-muted text-center py-4 mb-0">Aún no hay tweets.</p>}

      {result.items.map((t) => (
        <TweetCard key={t.id} tweet={t} author={author} />
      ))}

      <div className="d-flex justify-content-center">
        <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />
      </div>
    </section>
  )
}

export const UserTweetsPage = () => {
  const { username = '' } = useParams()
  // key resets the state when navigating from one profile to another
  return <UserTweets key={username} username={username} />
}
