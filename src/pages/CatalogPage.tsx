import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Notice } from '../components/Notice'
import { useLibrary } from '../context/useLibrary'
import { key } from '../utils/normalizers'

export function CatalogPage() {
  const { state, requestLoan } = useLibrary()
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [lastReceiptId, setLastReceiptId] = useState<string | null>(null)
  const [busyBookId, setBusyBookId] = useState<string | null>(null)
  const categoryName = (id: string) => state.categories.find((category) => category.id === id)?.name ?? 'Sin categoria'

  const books = useMemo(() => state.books.filter((book) => {
    const matchTitle = !query.trim() || key(book.title).includes(key(query))
    const matchCategory = !categoryId || book.categoryId === categoryId
    return matchTitle && matchCategory
  }), [state.books, query, categoryId])

  function borrow(bookId: string) {
    setBusyBookId(bookId)
    const result = requestLoan(bookId)
    setMessage(result.message)
    setLastReceiptId(result.ok ? result.id ?? null : null)
    setBusyBookId(null)
  }

  return (
    <section className="page">
      <h1>Catalogo</h1>
      <Notice message={message} type={message?.includes('registrado') ? 'success' : 'error'} />
      {lastReceiptId && <Link className="button-link" to={`/comprobante/${lastReceiptId}`}>Abrir comprobante generado</Link>}
      <section className="panel">
        <h2>Buscar libros</h2>
        <div className="filters">
          <label>Titulo<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por titulo" /></label>
          <label>Categoria<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">Todas</option>{state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        </div>
      </section>
      <section className="book-grid">
        {books.length === 0 && <p className="empty">No hay libros que coincidan con la busqueda.</p>}
        {books.map((book) => (
          <article className="book-card" key={book.id}>
            <p className={`status ${book.stock > 0 ? 'ok' : 'empty-stock'}`}>{book.stock > 0 ? 'Disponible' : 'Sin stock'}</p>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Categoria: {categoryName(book.categoryId)}</p>
            <p>Stock disponible: {book.stock}</p>
            <button type="button" disabled={book.stock <= 0 || busyBookId === book.id} onClick={() => borrow(book.id)}>Solicitar prestamo</button>
          </article>
        ))}
      </section>
    </section>
  )
}
