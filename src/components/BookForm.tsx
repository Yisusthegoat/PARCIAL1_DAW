import { useState, type FormEvent } from 'react'
import type { Book, Category } from '../types/library'
import { hasValidIsbnChars, LIMITS } from '../utils/validation'

interface Props {
  categories: Category[]
  initial?: Book
  onSubmit: (book: Omit<Book, 'id'> | Book) => boolean
  onCancel?: () => void
}

export function BookForm({ categories, initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [isbn, setIsbn] = useState(initial?.isbn ?? '')
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '')
  const [stock, setStock] = useState(String(initial?.stock ?? 0))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    const parsedStock = Number(stock)
    if (!title.trim()) nextErrors.title = 'Campo obligatorio.'
    else if (title.trim().length > LIMITS.bookTitleMax) nextErrors.title = `Maximo ${LIMITS.bookTitleMax} caracteres.`
    if (!author.trim()) nextErrors.author = 'Campo obligatorio.'
    else if (author.trim().length > LIMITS.authorMax) nextErrors.author = `Maximo ${LIMITS.authorMax} caracteres.`
    if (!isbn.trim()) nextErrors.isbn = 'Campo obligatorio.'
    else if (isbn.trim().length > LIMITS.isbnMax) nextErrors.isbn = `Maximo ${LIMITS.isbnMax} caracteres.`
    else if (!hasValidIsbnChars(isbn)) nextErrors.isbn = 'Use solo numeros, X y guiones.'
    if (!categoryId) nextErrors.categoryId = 'Seleccione una categoria.'
    if (!Number.isInteger(parsedStock) || parsedStock < 0) nextErrors.stock = 'Ingrese un entero mayor o igual que cero.'
    else if (parsedStock > LIMITS.stockMax) nextErrors.stock = `Maximo ${LIMITS.stockMax}.`
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const payload = { title, author, isbn, categoryId, stock: parsedStock }
    const saved = onSubmit(initial ? { ...payload, id: initial.id } : payload)
    if (saved && !initial) {
      setTitle('')
      setAuthor('')
      setIsbn('')
      setStock('0')
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>Titulo<input maxLength={LIMITS.bookTitleMax} value={title} onChange={(event) => setTitle(event.target.value)} />{errors.title && <span>{errors.title}</span>}</label>
      <label>Autor<input maxLength={LIMITS.authorMax} value={author} onChange={(event) => setAuthor(event.target.value)} />{errors.author && <span>{errors.author}</span>}</label>
      <label>ISBN<input maxLength={LIMITS.isbnMax} pattern="[0-9Xx-]+" value={isbn} onChange={(event) => setIsbn(event.target.value)} />{errors.isbn && <span>{errors.isbn}</span>}</label>
      <label>Categoria<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{errors.categoryId && <span>{errors.categoryId}</span>}</label>
      <label>Stock<input type="number" min="0" max={LIMITS.stockMax} step="1" value={stock} onChange={(event) => setStock(event.target.value)} />{errors.stock && <span>{errors.stock}</span>}</label>
      <div className="form-actions">
        <button type="submit">{initial ? 'Guardar cambios' : 'Registrar libro'}</button>
        {onCancel && <button className="ghost" type="button" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  )
}
