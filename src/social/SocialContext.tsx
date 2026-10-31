import { createContext } from 'react'
import type { Tweet } from '../types/social'

export interface SocialContextValue {
  tweets: Tweet[]
  followingIds: number[]
  followerIds: number[]
  isFollowing: (userId: number) => boolean
  follow: (userId: number) => void
  addTweet: (text: string) => void
  getCounts: (userId: number) => { followers: number; following: number }
}

export const SocialContext = createContext<SocialContextValue | undefined>(undefined)
