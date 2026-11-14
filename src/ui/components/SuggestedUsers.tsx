import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/contexts/useAuth'
import { useSocial } from '../../social/useSocial'
import { getRecentUsers } from '../../firebase/users'
import { toMessage } from '../../firebase/errors'
import { UserCard } from './UserCard'
import { Notice, type NoticeState } from './Notice'
import type { UserProfile } from '../../types/social'

// Newest accounts that you don't follow yet. Following one removes it from the list.
export const SuggestedUsers = ({ max = 5 }: { max?: number }) => {
  const { user } = useAuth()
  const { ready, followingIds, followById } = useSocial()
  const [candidates, setCandidates] = useState<UserProfile[]>([])
  const [loaded, setLoaded] = useState(false)
  const [notice, setNotice] = useState<NoticeState | null>(null)

  useEffect(() => {
    let cancelled = false
    getRecentUsers(30)
      .then((list) => {
        if (!cancelled) setCandidates(list)
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const onFollow = async (id: string) => {
    try {
      const target = await followById(id)
      setNotice({ type: 'success', text: `Ahora sigues a @${target.username}.` })
    } catch (e) {
      setNotice({ type: 'warning', text: toMessage(e) })
    }
  }

  if (!loaded || !ready) return null

  const suggestions = candidates
    .filter((u) => u.id !== user?.id && !followingIds.includes(u.id))
    .slice(0, max)

  if (suggestions.length === 0 && !notice) return null

  return (
    <section className="d-flex flex-column gap-2">
      <h2 className="h6 fw-semibold mb-0">Sugerencias para seguir</h2>
      <Notice notice={notice} onClose={() => setNotice(null)} />
      {suggestions.map((u) => (
        <UserCard key={u.id} user={u} showFollow following={false} onFollow={onFollow} />
      ))}
    </section>
  )
}
