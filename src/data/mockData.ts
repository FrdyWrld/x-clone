import type { Tweet, UserProfile } from '../types/social'

const names = [
  'Fredy Licona', 'Andrés Pérez', 'Camila Rojas', 'Daniel Torres',
  'Valentina Ruiz', 'Sebastián Mora', 'Isabella Cano', 'Mateo Vargas',
  'Sofía Herrera', 'Santiago Ríos', 'Mariana Londoño', 'Juan Ospina',
  'Luisa Mejía', 'Felipe Castaño', 'Daniela Arango', 'Nicolás Giraldo',
  'Paula Zapata', 'Julián Restrepo', 'Manuela Duque', 'Tomás Salazar',
  'Gabriela Soto', 'Emilio Franco', 'Natalia Builes', 'Samuel Cardona',
]

const slug = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '_')

export const users: UserProfile[] = names.map((fullName, i) => ({
  id: i + 1,
  fullName,
  username: slug(fullName),
  email: `${slug(fullName)}@correo.com`,
}))

export const CURRENT_USER_ID = 1

export const initialFollowingIds = [2, 4, 6, 8, 9, 11, 12, 14, 16, 17, 19, 21, 22]
export const followerIds = [2, 3, 5, 7, 8, 10, 12, 13, 15, 16, 18, 20, 21, 23, 24]

const phrases = [
  'Hola mundo, este es mi primer tweet.',
  'Hoy aprendí algo nuevo sobre React.',
  'Café, código y buena música.',
  'Alguien más está construyendo un clon de X?',
  'Los lunes también pueden ser productivos.',
  'Probando el nuevo diseño de la SPA.',
]

const BASE = Date.UTC(2026, 9, 27, 12, 0, 0)

const TWEETS_PER_USER = 4

// Some users get extra tweets so profile pagination can be demonstrated
const tweetCountFor = (userId: number) => {
  if (userId === CURRENT_USER_ID) return 14
  if (userId === 2) return 12
  return TWEETS_PER_USER
}

export const initialTweets: Tweet[] = users.flatMap((u) =>
  Array.from({ length: tweetCountFor(u.id) }, (_, k) => ({
    id: u.id * 100 + k,
    userId: u.id,
    text: phrases[(u.id + k) % phrases.length],
    createdAt: new Date(BASE - (u.id * 4 + k * 7) * 3600 * 1000).toISOString(),
  })),
)

// Simulated counters for users other than the logged-in one
export const mockCounts = (userId: number) => ({
  followers: (userId * 7) % 40 + 3,
  following: (userId * 5) % 30 + 2,
})