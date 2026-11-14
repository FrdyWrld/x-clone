import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './config'
import { AppError } from './errors'
import { uploadTweetMedia } from '../services/cloudinary'
import { chunk } from '../helpers/chunk'
import { validateFiles } from '../helpers/media'
import type { Tweet, UserProfile } from '../types/social'

export const MAX_TWEET_LENGTH = 280

const toTweet = (d: QueryDocumentSnapshot): Tweet => {
  const data = d.data()
  return {
    id: d.id,
    userId: data.authorId,
    text: data.text ?? '',
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
    authorUsername: data.authorUsername,
    authorFullName: data.authorFullName,
    media: data.media ?? [], // tweets created before attachments existed have no media
  }
}

const newestFirst = (a: Tweet, b: Tweet) => b.createdAt.localeCompare(a.createdAt)

// A tweet needs text, attachments, or both. Files go to Cloudinary; only their links are saved in Firestore.
export async function publishTweet(
  author: UserProfile,
  text: string,
  files: File[] = [],
  onProgress?: (fraction: number) => void,
): Promise<void> {
  const clean = text.trim()
  if (!clean && files.length === 0) throw new AppError('El tweet no puede estar vacío.')
  if (clean.length > MAX_TWEET_LENGTH) {
    throw new AppError(`El tweet no puede superar los ${MAX_TWEET_LENGTH} caracteres.`)
  }
  const problem = validateFiles(files)
  if (problem) throw new AppError(problem)

  const media = await uploadTweetMedia(files, onProgress)
  await addDoc(collection(db, 'tweets'), {
    authorId: author.id,
    authorUsername: author.username,
    authorFullName: author.fullName,
    text: clean,
    media,
    createdAt: serverTimestamp(),
  })
}

export async function getTweetsByAuthors(authorIds: string[]): Promise<Tweet[]> {
  const unique = [...new Set(authorIds)]
  const groups = await Promise.all(
    chunk(unique, 30).map(async (part) => {
      const snap = await getDocs(query(collection(db, 'tweets'), where('authorId', 'in', part)))
      return snap.docs.map(toTweet)
    }),
  )
  // Sorted in memory, so Firestore does not need a composite index
  return groups.flat().sort(newestFirst)
}

export const getTweetsByAuthor = (authorId: string) => getTweetsByAuthors([authorId])

// Latest tweets of the whole community (empty feed and "Explorar" tab)
export async function getRecentTweets(max = 10): Promise<Tweet[]> {
  const snap = await getDocs(query(collection(db, 'tweets'), orderBy('createdAt', 'desc'), limit(max)))
  return snap.docs.map(toTweet)
}
