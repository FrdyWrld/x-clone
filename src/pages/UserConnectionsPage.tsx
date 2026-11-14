import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'
import { useSocial } from '../social/useSocial'
import { getProfileByUsername, getProfiles } from '../firebase/users'
import { getFollowerIds, getFollowingIds } from '../firebase/follows'
import { toMessage } from '../firebase/errors'
import { paginate } from '../helpers/paginate'
import { UserCard } from '../ui/components/UserCard'
import { Pagination } from '../ui/components/Pagination'
import { Loading } from '../ui/components/Loading'
import { Notice, type NoticeState } from '../ui/components/Notice'
import type { UserProfile } from '../types/social'

type Kind = 'followers' | 'following'
type Status = 'loading' | 'ready' | 'notfound' | 'error'

// Followers or following of any user, alphabetical by full name, 10 per page
const Connections = ({ username, kind }: { username: string; kind: Kind }) => {
  const { user: me } = useAuth()
  const { ready, isFollowing, followById } = useSocial()
  const [owner, setOwner] = useState<UserProfile | null>(null)
  const [profiles, setProfiles] = useState<UserProfile[]>([])
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
        const ids = kind === 'followers' ? await getFollowerIds(found.id) : await getFollowingIds(found.id)
        const list = await getProfiles(ids)
        list.sort((a, b) => a.fullName.localeCompare(b.fullName, 'es'))
        if (cancelled) return
        setOwner(found)
        setProfiles(list)
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [username, kind])

  if (status === 'loading') return <Loading />
  if (status === 'notfound') {
    return <p className="text-muted text-center py-5">El usuario @{username} no existe.</p>
  }
  if (status === 'error' || !owner) {
    return <div className="alert alert-danger">No se pudo cargar la lista.</div>
  }

  const onFollow = async (id: string) => {
    try {
      const target = await followById(id)
      setNotice({ type: 'success', text: `Ahora sigues a @${target.username}.` })
    } catch (e) {
      setNotice({ type: 'warning', text: toMessage(e) })
    }
  }

  const result = paginate(profiles, page)
  const title = kind === 'followers' ? 'Seguidores de' : 'Usuarios que sigue'
  const empty = kind === 'followers' ? 'Todavía no tiene seguidores.' : 'Todavía no sigue a nadie.'

  return (
    <section className="d-flex flex-column gap-3">
      <div>
        <h1 className="h4 fw-bold mb-0">
          {title} {owner.fullName} ({result.total})
        </h1>
        <Link to={`/users/${owner.username}`}>
          <i className="bi bi-arrow-left me-1"></i>@{owner.username}
        </Link>
      </div>

      <Notice notice={notice} onClose={() => setNotice(null)} />

      {result.total === 0 && <p className="text-muted text-center py-4 mb-0">{empty}</p>}

      {result.items.map((u) => (
        <UserCard
          key={u.id}
          user={u}
          showFollow
          // no "Seguir" for yourself, for users you already follow, or until your own list has loaded
          following={!ready || u.id === me?.id || isFollowing(u.id)}
          onFollow={onFollow}
        />
      ))}

      <div className="d-flex justify-content-center">
        <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />
      </div>
    </section>
  )
}

export const UserConnectionsPage = ({ kind }: { kind: Kind }) => {
  const { username = '' } = useParams()
  // key resets the state when the user or the list changes
  return <Connections key={`${username}/${kind}`} username={username} kind={kind} />
}
