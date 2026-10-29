import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/contexts/useAuth'
import { useSocial } from '../social/useSocial'

const MAX_LENGTH = 280

export const ComposePage = () => {
  const [text, setText] = useState('')
  const { user } = useAuth()
  const { addTweet } = useSocial()
  const navigate = useNavigate()

  const remaining = MAX_LENGTH - text.length
  const isNearLimit = remaining <= 20

const onSubmit = (e: FormEvent) => {
  e.preventDefault()
  if (!user || !text.trim()) return
  addTweet(text.trim())
  navigate(`/users/${user.username}`)
}

  return (
    <section className="container py-4" style={{ maxWidth: 640 }}>
      <header className="border-bottom pb-3 mb-4">
        <h1 className="h4 fw-bold mb-0">Publicar tweet</h1>
      </header>

      <form onSubmit={onSubmit} className="card shadow-sm border-0">
        <div className="card-body">
          <label htmlFor="tweet-text" className="visually-hidden">
            Mensaje del tweet
          </label>
          <textarea
            id="tweet-text"
            className="form-control border-0 fs-5"
            style={{ resize: 'none', boxShadow: 'none' }}
            rows={5}
            maxLength={MAX_LENGTH}
            placeholder="¿Qué está pasando?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="card-footer bg-transparent d-flex align-items-center justify-content-between">
          <small className={isNearLimit ? 'text-danger fw-semibold' : 'text-muted'}>
            {text.length}/{MAX_LENGTH}
          </small>
          <button
            type="submit"
            className="btn btn-primary rounded-pill px-4"
            disabled={!text.trim()}
          >
            Publicar
          </button>
        </div>
      </form>
    </section>
  )
}