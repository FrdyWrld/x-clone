import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

export const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (login(username, password)) navigate('/')
    else setError('Ingresa usuario y contraseña.')
  }

  const onGoogle = () => {
    loginWithGoogle()
    navigate('/')
  }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="card shadow border-0 w-100" style={{ maxWidth: 440 }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 fw-bold text-center mb-4">Iniciar sesión</h1>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nombre de usuario</label>
              <div className="input-group">
                <input
                  id="username"
                  className="form-control"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                className="form-control"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg rounded-pill">
                Entrar
              </button>
            </div>
          </form>

          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1 m-0" />
            <span className="px-3 text-muted small">o</span>
            <hr className="flex-grow-1 m-0" />
          </div>

          <div className="d-grid">
            <button
              type="button"
              className="btn btn-outline-secondary btn-lg rounded-pill"
              onClick={onGoogle}
            >
              <i className="bi bi-google me-2"></i>
              Continuar con Google
            </button>
          </div>

          <p className="text-center text-muted mt-4 mb-0">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}