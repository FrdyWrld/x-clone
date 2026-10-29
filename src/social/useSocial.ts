import { useContext } from 'react'
import { SocialContext } from './SocialContext'

export const useSocial = () => {
  const ctx = useContext(SocialContext)
  if (!ctx) throw new Error('useSocial debe usarse dentro de SocialProvider')
  return ctx
}
