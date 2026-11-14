import { useEffect, useState } from 'react'
import { useSocial } from '../social/useSocial'
import { getProfiles } from '../firebase/users'
import { toMessage } from '../firebase/errors'
import { paginate } from '../helpers/paginate'
import { UserCard } from '../ui/components/UserCard'
import { Pagination } from '../ui/components/Pagination'
import { Loading } from '../ui/components/Loading'
import { Notice, type NoticeState } from '../ui/components/Notice'
import type { UserProfile } from '../types/social'

export const FollowersPage = () => {
  const { ready, followerIds, isFollowing, followById } = useSocial()
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState<NoticeState | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    const load = async () => {
      try {
        const list = await getProfiles(followerIds)
        list.sort((a, b) => a.fullName.localeCompare(b.fullName, 'es'))
        if (!cancelled) {
          setProfiles(list)
          setError('')
        }
      } catch {
        if (!cancelled) setError('No se pudo cargar la lista.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [ready, followerIds])

  const onFollow = async (id: string) => {
    try {
      const target = await followById(id)
      setNotice({ type: 'success', text: `Ahora sigues a @${target.username}.` })
    } catch (e) {
      setNotice({ type: 'warning', text: toMessage(e) })
    }
  }

  const result = paginate(profiles, page)

  return (
    <section className="d-flex flex-column gap-3">
      <h1 className="h4 fw-bold mb-0">Tus seguidores ({followerIds.length})</h1>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      {loading && <Loading />}
      {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}
      {!loading && !error && result.total === 0 && (
        <p className="text-muted text-center py-4 mb-0">Todavía no tienes seguidores.</p>
      )}

      {result.items.map((u) => (
        <UserCard key={u.id} user={u} showFollow following={isFollowing(u.id)} onFollow={onFollow} />
      ))}

      <div className="d-flex justify-content-center">
        <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />
      </div>
    </section>
  )
}
