import { useState } from 'react'
import type { FormEvent } from 'react'
import { Notice } from '../components/Notice'
import { useLibrary } from '../context/useLibrary'

export function CategoriesPage() {
  const { state, addCategory, updateCategory, deleteCategory } = useLibrary()
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = addCategory(name)
    setMessage(result.message)
    if (result.ok) setName('')
  }

  return (
    <section className="page">
      <h1>Categorias</h1>
      <Notice message={message} type={message?.includes('registr') || message?.includes('actualizada') || message?.includes('eliminada') ? 'success' : 'error'} />
      <section className="panel">
        <h2>Registrar categoria</h2>
        <form className="inline-form" onSubmit={submit}>
          <label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} />{!name.trim() && <span>Campo obligatorio.</span>}</label>
          <button type="submit">Registrar</button>
        </form>
      </section>
      <section className="panel">
        <h2>Listado</h2>
        <div className="table-wrap"><table><thead><tr><th>Categoria</th><th>Acciones</th></tr></thead><tbody>
          {state.categories.map((category) => (
            <tr key={category.id}>
              <td>{editingId === category.id ? <input value={editingName} onChange={(event) => setEditingName(event.target.value)} /> : category.name}</td>
              <td className="actions">
                {editingId === category.id ? (
                  <>
                    <button type="button" onClick={() => { const result = updateCategory(category.id, editingName); setMessage(result.message); if (result.ok) setEditingId(null) }}>Guardar</button>
                    <button className="ghost" type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => { setEditingId(category.id); setEditingName(category.name) }}>Editar</button>
                    <button className="danger" type="button" onClick={() => { if (confirm('Confirme la eliminacion de la categoria.')) setMessage(deleteCategory(category.id).message) }}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody></table></div>
      </section>
    </section>
  )
}
