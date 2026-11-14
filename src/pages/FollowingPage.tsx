import { useEffect, useState } from 'react'
import { useSocial } from '../social/useSocial'
import { getProfiles } from '../firebase/users'
import { paginate } from '../helpers/paginate'
import { UserCard } from '../ui/components/UserCard'
import { Pagination } from '../ui/components/Pagination'
import { FollowForm } from '../ui/components/FollowForm'
import { Loading } from '../ui/components/Loading'
import type { UserProfile } from '../types/social'

export const FollowingPage = () => {
  const { ready, followingIds } = useSocial()
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    const load = async () => {
      try {
        const list = await getProfiles(followingIds)
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
  }, [ready, followingIds])

  const result = paginate(profiles, page)

  return (
    <section className="d-flex flex-column gap-3">
      <h1 className="h4 fw-bold mb-0">Usuarios que sigues ({followingIds.length})</h1>

      <FollowForm />

      {loading && <Loading />}
      {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}
      {!loading && !error && result.total === 0 && (
        <p className="text-muted text-center py-4 mb-0">Todavía no sigues a nadie.</p>
      )}

      {result.items.map((u) => (
        <UserCard key={u.id} user={u} />
      ))}

      <div className="d-flex justify-content-center">
        <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />
      </div>
    </section>
  )
}
