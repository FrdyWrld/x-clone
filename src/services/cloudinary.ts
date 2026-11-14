import { AppError } from '../firebase/errors'
import type { TweetMedia } from '../types/social'

// Set in .env (see docs/cloudinary-setup.md). The preset must be "unsigned".
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

interface CloudinaryResponse {
  secure_url?: string
  public_id?: string
  resource_type?: string
  error?: { message?: string }
}

// XMLHttpRequest (not fetch) because it reports upload progress
function uploadOne(file: File, onProgress: (loadedBytes: number) => void): Promise<TweetMedia> {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new AppError('Falta configurar Cloudinary: revisa VITE_CLOUDINARY_* en el archivo .env.'))
      return
    }

    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', UPLOAD_PRESET)

    const xhr = new XMLHttpRequest()
    // "auto" lets Cloudinary detect whether the file is an image (GIFs included) or a video
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded)
    }

    xhr.onload = () => {
      let data: CloudinaryResponse = {}
      try {
        data = JSON.parse(xhr.responseText) as CloudinaryResponse
      } catch {
        // the response was not JSON
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url && data.public_id) {
        resolve({
          url: data.secure_url,
          type: data.resource_type === 'video' ? 'video' : 'image',
          path: data.public_id,
        })
        return
      }
      const detail = data.error?.message
      reject(new AppError(detail ? `Cloudinary: ${detail}` : 'No se pudo subir el archivo.'))
    }

    xhr.onerror = () => reject(new AppError('No hay conexión con Cloudinary. Revisa tu internet.'))
    xhr.send(form)
  })
}

// Uploads the files in parallel and reports the overall progress (0 to 1)
export async function uploadTweetMedia(
  files: File[],
  onProgress?: (fraction: number) => void,
): Promise<TweetMedia[]> {
  if (files.length === 0) return []

  const total = files.reduce((sum, f) => sum + f.size, 0) || 1
  const loaded = files.map(() => 0)

  const results = await Promise.allSettled(
    files.map((file, i) =>
      uploadOne(file, (bytes) => {
        loaded[i] = bytes
        onProgress?.(Math.min(1, loaded.reduce((a, b) => a + b, 0) / total))
      }),
    ),
  )

  const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected')
  if (failed) {
    throw failed.reason instanceof Error ? failed.reason : new AppError('No se pudo subir el archivo.')
  }
  return results.map((r) => (r as PromiseFulfilledResult<TweetMedia>).value)
}
