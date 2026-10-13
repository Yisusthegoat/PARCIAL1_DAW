import { useState } from 'react'
import type { FormEvent } from 'react'
import { Notice } from '../components/Notice'
import { useLibrary } from '../context/useLibrary'
import type { UserType } from '../types/library'
import { isEmail } from '../utils/normalizers'

export function UsersPage() {
  const { state, addUser } = useLibrary()
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState({ fullName: '', universityCode: '', email: '', username: '', password: '', type: 'Estudiante' as UserType })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Ingrese nombres y apellidos.'
    if (!form.universityCode.trim()) nextErrors.universityCode = 'Ingrese el codigo universitario.'
    if (!form.email.trim()) nextErrors.email = 'Ingrese el correo electronico.'
    else if (!isEmail(form.email)) nextErrors.email = 'Ingrese un correo valido.'
    if (!form.username.trim()) nextErrors.username = 'Ingrese el usuario de acceso.'
    if (!form.password.trim()) nextErrors.password = 'Ingrese la contrasena.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setMessage('Revise los campos marcados.')
      return
    }

    const result = addUser(form)
    setMessage(result.message)
    if (result.ok) {
      setErrors({})
      setForm({ fullName: '', universityCode: '', email: '', username: '', password: '', type: 'Estudiante' })
    }
  }

  return (
    <section className="page">
      <h1>Usuarios</h1>
      <Notice message={message} type={message?.includes('registrado') ? 'success' : 'error'} />
      <section className="panel">
        <h2>Registrar usuario</h2>
        <form className="form-grid" onSubmit={submit} noValidate>
          <label>Nombres y apellidos<input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />{errors.fullName && <span>{errors.fullName}</span>}</label>
          <label>Codigo universitario<input value={form.universityCode} onChange={(event) => setForm({ ...form, universityCode: event.target.value })} />{errors.universityCode && <span>{errors.universityCode}</span>}</label>
          <label>Correo electronico<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />{errors.email && <span>{errors.email}</span>}</label>
          <label>Usuario de acceso<input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />{errors.username && <span>{errors.username}</span>}</label>
          <label>Contrasena<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />{errors.password && <span>{errors.password}</span>}</label>
          <label>Tipo<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as UserType })}><option>Estudiante</option><option>Docente</option></select></label>
          <div className="form-actions"><button type="submit">Registrar usuario</button></div>
        </form>
      </section>
      <section className="panel">
        <h2>Listado</h2>
        <div className="table-wrap"><table><thead><tr><th>Nombre</th><th>Codigo</th><th>Correo</th><th>Usuario</th><th>Tipo</th></tr></thead><tbody>
          {state.users.map((user) => <tr key={user.id}><td>{user.fullName}</td><td>{user.universityCode}</td><td>{user.email}</td><td>{user.username}</td><td>{user.type}</td></tr>)}
        </tbody></table></div>
      </section>
    </section>
  )
}
