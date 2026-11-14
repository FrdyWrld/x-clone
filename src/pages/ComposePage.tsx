import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'
import { MAX_TWEET_LENGTH, publishTweet } from '../firebase/tweets'
import { toMessage } from '../firebase/errors'
import { MEDIA_ACCEPT, mediaKind, validateFiles } from '../helpers/media'
import { Notice, type NoticeState } from '../ui/components/Notice'

interface Attachment {
  id: string
  file: File
  url: string // local preview
}

export const ComposePage = () => {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [notice, setNotice] = useState<NoticeState | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInput = useRef<HTMLInputElement>(null)
  // Preview URLs that are still alive, so they can be released
  const previewUrls = useRef(new Set<string>())

  useEffect(() => {
    const urls = previewUrls.current
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [])

  const tooLong = text.length > MAX_TWEET_LENGTH
  const canPublish = !submitting && !tooLong && (text.trim().length > 0 || attachments.length > 0)

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = '' // lets the user pick the same file again
    if (picked.length === 0) return

    const problem = validateFiles([...attachments.map((a) => a.file), ...picked])
    if (problem) {
      setNotice({ type: 'warning', text: problem })
      return
    }
    setNotice(null)
    const added = picked.map((file, i) => {
      const url = URL.createObjectURL(file)
      previewUrls.current.add(url)
      return { id: `${Date.now()}-${i}`, file, url }
    })
    setAttachments((prev) => [...prev, ...added])
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id)
      if (target) {
        URL.revokeObjectURL(target.url)
        previewUrls.current.delete(target.url)
      }
      return prev.filter((a) => a.id !== id)
    })
  }

  const clearAttachments = () => {
    previewUrls.current.forEach((u) => URL.revokeObjectURL(u))
    previewUrls.current.clear()
    setAttachments([])
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || !canPublish) return
    setNotice(null)
    setSubmitting(true)
    setProgress(0)
    try {
      await publishTweet(user, text, attachments.map((a) => a.file), setProgress)
      setText('')
      clearAttachments()
      setNotice({ type: 'success', text: 'Tweet publicado correctamente.' })
    } catch (error) {
      setNotice({ type: 'danger', text: toMessage(error) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="d-flex flex-column gap-3">
      <h1 className="h4 fw-bold mb-0">Publicar tweet</h1>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <form onSubmit={onSubmit} className="card shadow-sm border-0">
        <div className="card-body">
          <textarea
            className={`form-control ${tooLong ? 'is-invalid' : ''}`}
            rows={5}
            placeholder="¿Qué está pasando?"
            aria-label="Texto del tweet"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className={`small mt-1 ${tooLong ? 'text-danger' : 'text-muted'}`}>
            {text.length}/{MAX_TWEET_LENGTH}
            {tooLong && ' - el tweet es demasiado largo'}
          </div>

          {attachments.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {attachments.map((a) => (
                <div key={a.id} className="position-relative" style={{ width: 120, height: 120 }}>
                  {mediaKind(a.file) === 'video' ? (
                    <video src={a.url} muted className="w-100 h-100 rounded bg-dark" style={{ objectFit: 'cover' }} />
                  ) : (
                    <img src={a.url} alt="Vista previa" className="w-100 h-100 rounded" style={{ objectFit: 'cover' }} />
                  )}
                  <button
                    type="button"
                    className="btn btn-dark btn-sm rounded-circle position-absolute top-0 end-0 m-1 lh-1"
                    aria-label="Quitar archivo"
                    disabled={submitting}
                    onClick={() => removeAttachment(a.id)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {submitting && attachments.length > 0 && (
            <div className="progress mt-3" role="progressbar" aria-label="Subiendo archivos">
              <div className="progress-bar" style={{ width: `${Math.round(progress * 100)}%` }}>
                {Math.round(progress * 100)}%
              </div>
            </div>
          )}

          <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
            <input
              ref={fileInput}
              type="file"
              hidden
              multiple
              accept={MEDIA_ACCEPT}
              onChange={onPick}
            />
            <button
              type="button"
              className="btn btn-outline-primary btn-sm rounded-pill"
              disabled={submitting}
              onClick={() => fileInput.current?.click()}
            >
              <i className="bi bi-image me-1"></i>
              Foto, GIF o video
            </button>

            <button type="submit" className="btn btn-primary rounded-pill px-4 ms-auto" disabled={!canPublish}>
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
          <div className="form-text">Hasta 4 imágenes (5 MB c/u) o 1 video (25 MB).</div>
          <Link to={`/users/${user?.username}`} className="small">Ver mis tweets</Link>
        </div>
      </form>
    </section>
  )
}
