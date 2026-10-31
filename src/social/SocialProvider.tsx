import { useState, type ReactNode } from 'react'
import { SocialContext } from './SocialContext'
import type { Tweet } from '../types/social'
import { useAuth } from '../auth/contexts/useAuth'
import {
  CURRENT_USER_ID,
  followerIds,
  initialFollowingIds,
  initialTweets,
  mockCounts,
} from '../data/mockData'

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets)
  const [followingIds, setFollowingIds] = useState<number[]>(initialFollowingIds)

  const myId = user?.id ?? CURRENT_USER_ID

  const follow = (userId: number) =>
    setFollowingIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]))

  const addTweet = (text: string) =>
    setTweets((prev) => [
      { id: Date.now(), userId: myId, text, createdAt: new Date().toISOString() },
      ...prev,
    ])

  const getCounts = (userId: number) =>
    userId === myId
      ? { followers: followerIds.length, following: followingIds.length }
      : mockCounts(userId)

  return (
    <SocialContext.Provider
      value={{
        tweets,
        followingIds,
        followerIds,
        isFollowing: (id) => followingIds.includes(id),
        follow,
        addTweet,
        getCounts,
      }}
    >
      {children}
    </SocialContext.Provider>
  )
}
