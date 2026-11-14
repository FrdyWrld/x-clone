export const MAX_FILES = 4
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export const MEDIA_ACCEPT = [...IMAGE_TYPES, ...VIDEO_TYPES].join(',')

export type MediaKind = 'image' | 'video'

export const mediaKind = (file: File): MediaKind | null => {
  if (IMAGE_TYPES.includes(file.type)) return 'image'
  if (VIDEO_TYPES.includes(file.type)) return 'video'
  return null
}

// Returns an error message, or null when the files can be attached
export function validateFiles(files: File[]): string | null {
  if (files.length === 0) return null
  if (files.length > MAX_FILES) return `Puedes adjuntar hasta ${MAX_FILES} archivos.`

  const kinds = files.map(mediaKind)
  if (kinds.includes(null)) {
    return 'Solo se permiten imágenes (JPG, PNG, GIF, WebP) y videos (MP4, WebM, MOV).'
  }
  if (kinds.includes('video') && files.length > 1) {
    return 'Un tweet puede llevar hasta 4 imágenes o 1 video, pero no ambos.'
  }
  for (const file of files) {
    const isVideo = mediaKind(file) === 'video'
    const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
    if (file.size > limit) {
      return `"${file.name}" supera el máximo de ${limit / (1024 * 1024)} MB para ${isVideo ? 'videos' : 'imágenes'}.`
    }
  }
  return null
}
