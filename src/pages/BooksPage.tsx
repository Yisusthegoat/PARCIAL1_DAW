import { useState } from 'react'
import { BookForm } from '../components/BookForm'
import { Notice } from '../components/Notice'
import { useLibrary } from '../context/useLibrary'
import type { Book } from '../types/library'

export function BooksPage() {
  const { state, addBook, updateBook, deleteBook } = useLibrary()
  const [editing, setEditing] = useState<Book | undefined>()
  const [message, setMessage] = useState<string | null>(null)
  const categoryName = (id: string) => state.categories.find((category) => category.id === id)?.name ?? 'Sin categoria'

  return (
    <section className="page">
      <h1>Libros</h1>
      <Notice message={message} type={message?.includes('registr') || message?.includes('actualizado') || message?.includes('eliminado') ? 'success' : 'error'} />
      <section className="panel">
        <h2>{editing ? 'Editar libro' : 'Registrar libro'}</h2>
        <BookForm key={editing?.id ?? 'new-book'} categories={state.categories} initial={editing} onCancel={() => setEditing(undefined)} onSubmit={(book) => {
          const result = 'id' in book ? updateBook(book) : addBook(book)
          setMessage(result.message)
          if (result.ok) setEditing(undefined)
          return result.ok
        }} />
      </section>
      <section className="panel">
        <h2>Listado</h2>
        <div className="table-wrap"><table><thead><tr><th>Titulo</th><th>Autor</th><th>ISBN</th><th>Categoria</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>
          {state.books.map((book) => (
            <tr key={book.id}><td>{book.title}</td><td>{book.author}</td><td>{book.isbn}</td><td>{categoryName(book.categoryId)}</td><td>{book.stock}</td><td className="actions"><button type="button" onClick={() => setEditing(book)}>Editar</button><button className="danger" type="button" onClick={() => { if (confirm('Confirme la eliminacion del libro.')) setMessage(deleteBook(book.id).message) }}>Eliminar</button></td></tr>
          ))}
        </tbody></table></div>
      </section>
    </section>
  )
}
