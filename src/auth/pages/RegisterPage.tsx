import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

const initialForm = { fullName: '', username: '', email: '', password: '' }

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)

  const onChange = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    register(form)
    navigate('/')
  }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="card shadow border-0 w-100" style={{ maxWidth: 440 }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 fw-bold text-center mb-4">Crear cuenta</h1>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Nombre completo</label>
              <input
                id="fullName"
                className="form-control"
                autoComplete="name"
                required
                value={form.fullName}
                onChange={onChange('fullName')}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nombre de usuario</label>
              <div className="input-group">
                <input
                  id="username"
                  className="form-control"
                  autoComplete="username"
                  required
                  value={form.username}
                  onChange={onChange('username')}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                id="email"
                type="email"
                className="form-control"
                autoComplete="email"
                required
                value={form.email}
                onChange={onChange('email')}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                className="form-control"
                autoComplete="new-password"
                required
                minLength={6}
                value={form.password}
                onChange={onChange('password')}
              />
              <div className="form-text">Mínimo 6 caracteres.</div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg rounded-pill">
                Registrarme
              </button>
            </div>
          </form>

          <p className="text-center text-muted mt-4 mb-0">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}