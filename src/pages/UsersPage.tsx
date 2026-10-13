import { useState } from 'react'
import type { FormEvent } from 'react'
import { Notice } from '../components/Notice'
import { useLibrary } from '../context/useLibrary'
import type { LibraryUser, UserType } from '../types/library'
import { isEmail } from '../utils/normalizers'
import { hasValidUsernameChars, LIMITS } from '../utils/validation'

export function UsersPage() {
  const { state, addUser, updateUser, deleteUser } = useLibrary()
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState({ fullName: '', universityCode: '', email: '', username: '', password: '', type: 'Estudiante' as UserType })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editing, setEditing] = useState<LibraryUser | null>(null)

  function resetForm() {
    setEditing(null)
    setErrors({})
    setForm({ fullName: '', universityCode: '', email: '', username: '', password: '', type: 'Estudiante' })
  }

  function startEdit(user: LibraryUser) {
    setEditing(user)
    setErrors({})
    setMessage(null)
    setForm({
      fullName: user.fullName,
      universityCode: user.universityCode,
      email: user.email,
      username: user.username,
      password: user.password,
      type: user.type,
    })
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Ingrese nombres y apellidos.'
    else if (form.fullName.trim().length > LIMITS.fullNameMax) nextErrors.fullName = `Maximo ${LIMITS.fullNameMax} caracteres.`
    if (!form.universityCode.trim()) nextErrors.universityCode = 'Ingrese el codigo universitario.'
    else if (form.universityCode.trim().length > LIMITS.universityCodeMax) nextErrors.universityCode = `Maximo ${LIMITS.universityCodeMax} caracteres.`
    if (!form.email.trim()) nextErrors.email = 'Ingrese el correo electronico.'
    else if (!isEmail(form.email)) nextErrors.email = 'Ingrese un correo valido.'
    else if (form.email.trim().length > LIMITS.emailMax) nextErrors.email = `Maximo ${LIMITS.emailMax} caracteres.`
    if (!form.username.trim()) nextErrors.username = 'Ingrese el usuario de acceso.'
    else if (form.username.trim().length < LIMITS.usernameMin || form.username.trim().length > LIMITS.usernameMax) nextErrors.username = `Entre ${LIMITS.usernameMin} y ${LIMITS.usernameMax} caracteres.`
    else if (!hasValidUsernameChars(form.username)) nextErrors.username = 'Use letras, numeros, punto, guion o guion bajo.'
    if (!form.password.trim()) nextErrors.password = 'Ingrese la contrasena.'
    else if (form.password.trim().length < LIMITS.passwordMin || form.password.trim().length > LIMITS.passwordMax) nextErrors.password = `Entre ${LIMITS.passwordMin} y ${LIMITS.passwordMax} caracteres.`
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setMessage('Revise los campos marcados.')
      return
    }

    const result = editing ? updateUser({ ...form, id: editing.id }) : addUser(form)
    setMessage(result.message)
    if (result.ok) {
      resetForm()
    }
  }

  return (
    <section className="page">
      <h1>Usuarios</h1>
      <Notice message={message} type={message?.includes('registrado') || message?.includes('actualizado') || message?.includes('eliminado') ? 'success' : 'error'} />
      <section className="panel">
        <h2>{editing ? 'Editar usuario' : 'Registrar usuario'}</h2>
        <form className="form-grid" onSubmit={submit} noValidate>
          <label>Nombres y apellidos<input maxLength={LIMITS.fullNameMax} value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />{errors.fullName && <span>{errors.fullName}</span>}</label>
          <label>Codigo universitario<input maxLength={LIMITS.universityCodeMax} value={form.universityCode} onChange={(event) => setForm({ ...form, universityCode: event.target.value })} />{errors.universityCode && <span>{errors.universityCode}</span>}</label>
          <label>Correo electronico<input type="email" maxLength={LIMITS.emailMax} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />{errors.email && <span>{errors.email}</span>}</label>
          <label>Usuario de acceso<input minLength={LIMITS.usernameMin} maxLength={LIMITS.usernameMax} pattern="[a-zA-Z0-9._-]+" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />{errors.username && <span>{errors.username}</span>}</label>
          <label>Contrasena<input type="password" minLength={LIMITS.passwordMin} maxLength={LIMITS.passwordMax} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />{errors.password && <span>{errors.password}</span>}</label>
          <label>Tipo<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as UserType })}><option>Estudiante</option><option>Docente</option></select></label>
          <div className="form-actions">
            <button type="submit">{editing ? 'Guardar cambios' : 'Registrar usuario'}</button>
            {editing && <button className="ghost" type="button" onClick={resetForm}>Cancelar</button>}
          </div>
        </form>
      </section>
      <section className="panel">
        <h2>Listado</h2>
        <div className="table-wrap"><table><thead><tr><th>Nombre</th><th>Codigo</th><th>Correo</th><th>Usuario</th><th>Tipo</th><th>Acciones</th></tr></thead><tbody>
          {state.users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.universityCode}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.type}</td>
              <td className="actions">
                <button type="button" onClick={() => startEdit(user)}>Editar</button>
                <button className="danger" type="button" onClick={() => { if (confirm('Confirme la eliminacion del usuario.')) setMessage(deleteUser(user.id).message) }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody></table></div>
      </section>
    </section>
  )
}
