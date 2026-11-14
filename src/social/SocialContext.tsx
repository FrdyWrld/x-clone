import { createContext } from 'react'
import type { UserProfile } from '../types/social'

export interface SocialContextValue {
  ready: boolean // true once the logged-in user's follow lists have been loaded
  followingIds: string[]
  followerIds: string[]
  isFollowing: (userId: string) => boolean
  followByUsername: (username: string) => Promise<UserProfile>
  followById: (userId: string) => Promise<UserProfile>
}

export const SocialContext = createContext<SocialContextValue | undefined>(undefined)
