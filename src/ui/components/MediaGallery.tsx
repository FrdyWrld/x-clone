import type { TweetMedia } from '../../types/social'

// Shows the attachments of a tweet: up to 4 images (GIFs animate) or a single video
export const MediaGallery = ({ media }: { media: TweetMedia[] }) => {
  if (media.length === 0) return null

  const video = media.find((m) => m.type === 'video')
  if (video) {
    return (
      <video
        src={video.url}
        controls
        preload="metadata"
        className="w-100 rounded mt-2 bg-dark"
        style={{ maxHeight: 420 }}
      />
    )
  }

  const single = media.length === 1
  return (
    <div
      className="d-grid gap-1 mt-2"
      style={{ gridTemplateColumns: single ? '1fr' : '1fr 1fr' }}
    >
      {media.map((m) => (
        <a key={m.path} href={m.url} target="_blank" rel="noreferrer">
          <img
            src={m.url}
            alt="Imagen adjunta"
            loading="lazy"
            className="w-100 rounded"
            style={
              single
                ? { maxHeight: 420, objectFit: 'contain' }
                : { aspectRatio: '1 / 1', objectFit: 'cover' }
            }
          />
        </a>
      ))}
    </div>
  )
}
