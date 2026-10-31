export interface UserProfile {
  id: number
  fullName: string
  username: string
  email: string
}

export interface Tweet {
  id: number
  userId: number
  text: string
  createdAt: string
}
