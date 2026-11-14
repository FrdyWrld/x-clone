import { useEffect, useState, type ReactNode } from 'react'
import { SocialContext } from './SocialContext'
import { useAuth } from '../auth/contexts/useAuth'
import { followById, followByUsername, listenFollowers, listenFollowing } from '../firebase/follows'
import { AppError } from '../firebase/errors'

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const uid = user?.id
  const [following, setFollowing] = useState<string[]>([])
  const [followers, setFollowers] = useState<string[]>([])
  // Which user each list belongs to: avoids showing the previous user's data after switching accounts
  const [followingUid, setFollowingUid] = useState<string | null>(null)
  const [followersUid, setFollowersUid] = useState<string | null>(null)

  // Firestore pushes every change, so counters and lists stay up to date
  useEffect(() => {
    if (!uid) return
    const stopFollowing = listenFollowing(uid, (ids) => {
      setFollowing(ids)
      setFollowingUid(uid)
    })
    const stopFollowers = listenFollowers(uid, (ids) => {
      setFollowers(ids)
      setFollowersUid(uid)
    })
    return () => {
      stopFollowing()
      stopFollowers()
    }
  }, [uid])

  const followingIds = uid && followingUid === uid ? following : []
  const followerIds = uid && followersUid === uid ? followers : []
  const ready = !!uid && followingUid === uid && followersUid === uid

  const requireUser = () => {
    if (!uid) throw new AppError('Debes iniciar sesión.')
    return uid
  }

  return (
    <SocialContext.Provider
      value={{
        ready,
        followingIds,
        followerIds,
        isFollowing: (id) => followingIds.includes(id),
        followByUsername: (username) => followByUsername(requireUser(), username),
        followById: (id) => followById(requireUser(), id),
      }}
    >
      {children}
    </SocialContext.Provider>
  )
}
