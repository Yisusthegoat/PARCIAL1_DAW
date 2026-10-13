import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Notice } from '../components/Notice'
import { useLibrary } from '../context/useLibrary'

export function AccessPage() {
  const { state, loginAdmin, loginUser } = useLibrary()
  const navigate = useNavigate()
  const [loginMode, setLoginMode] = useState<'admin' | 'user'>('user')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [message, setMessage] = useState<string | null>(null)

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const username = credentials.username.trim().toLocaleUpperCase('es-PE')
    const password = credentials.password.trim()

    if (loginMode === 'admin') {
      if (username === 'ADMIN' && password === 'admin123') {
        loginAdmin()
        navigate('/admin/libros')
        return
      }
      setMessage('Credenciales de administrador incorrectas.')
      return
    }

    const matchedUser = state.users.find((user) => user.username.trim().toLocaleUpperCase('es-PE') === username)

    if (!matchedUser || matchedUser.password !== password) {
      setMessage('Credenciales de usuario incorrectas.')
      return
    }

    loginUser(matchedUser.id)
    navigate('/catalogo')
  }

  return (
    <section className="page access-page">
      <div className="intranet-login">
        <section className="login-cover">
          <div className="uncp-seal" aria-hidden="true">UNCP</div>
          <p className="eyebrow">Universidad Nacional del Centro del Peru</p>
          <h1>INTRANET Biblioteca Universitaria</h1>
          <p>Sistema local para gestion de catalogo, prestamos, devoluciones y comprobantes digitales.</p>
          <dl className="login-help">
            <div><dt>Administrador</dt><dd>usuario: admin / clave: admin123</dd></div>
            <div><dt>Usuario</dt><dd>ana.torres / uncp2026</dd></div>
          </dl>
        </section>

        <section className="login-card" aria-labelledby="login-title">
          <h2 id="login-title">Acceso al sistema</h2>
          <Notice message={message} type={message?.includes('registrado') ? 'success' : 'error'} />
          <div className="segmented" role="tablist" aria-label="Tipo de acceso">
            <button className={loginMode === 'user' ? 'active' : ''} type="button" onClick={() => setLoginMode('user')}>Usuario</button>
            <button className={loginMode === 'admin' ? 'active' : ''} type="button" onClick={() => setLoginMode('admin')}>Administrador</button>
          </div>
          <form className="login-form" onSubmit={submitLogin}>
            <label>{loginMode === 'admin' ? 'Usuario administrador' : 'Usuario'}
              <input value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} autoComplete="username" required />
            </label>
            <label>Contrasena
              <input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} autoComplete="current-password" required />
            </label>
            <button type="submit">INGRESAR</button>
          </form>
          <p className="small-note">Login simulado para ejecucion local. Las credenciales no se envian a servidores externos.</p>
        </section>
      </div>

    </section>
  )
}
