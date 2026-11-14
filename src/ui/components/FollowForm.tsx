import { useState, type FormEvent } from 'react'
import { useSocial } from '../../social/useSocial'
import { toMessage } from '../../firebase/errors'
import { Notice, type NoticeState } from './Notice'

export const FollowForm = () => {
  const { followByUsername } = useSocial()
  const [username, setUsername] = useState('')
  const [notice, setNotice] = useState<NoticeState | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setNotice(null)
    setSubmitting(true)
    try {
      const target = await followByUsername(username)
      setNotice({ type: 'success', text: `Ahora sigues a @${target.username}.` })
      setUsername('')
    } catch (error) {
      // "Ya sigues a @x", "No existe el usuario" and the other validations come from the service
      setNotice({ type: 'warning', text: toMessage(error) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body d-flex flex-column gap-2">
        <h2 className="h6 fw-semibold mb-0">Seguir por nombre de usuario</h2>
        <Notice notice={notice} onClose={() => setNotice(null)} />
        <form onSubmit={onSubmit} className="input-group">
          <span className="input-group-text">@</span>
          <input
            className="form-control"
            placeholder="usuario"
            aria-label="Nombre de usuario a seguir"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting || !username.trim()}>
            Seguir
          </button>
        </form>
      </div>
    </div>
  )
}
