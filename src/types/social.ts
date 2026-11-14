export interface UserProfile {
  id: string
  fullName: string
  username: string
  email: string
}

export interface TweetMedia {
  url: string
  type: 'image' | 'video'
  path: string // location in Firebase Storage
}

export interface Tweet {
  id: string
  userId: string
  text: string
  createdAt: string
  authorUsername: string
  authorFullName: string
  media: TweetMedia[]
}
