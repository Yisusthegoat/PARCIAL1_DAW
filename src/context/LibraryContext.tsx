import { type ReactNode, useMemo, useState } from 'react'
import type { ActionResult, Book, LibraryState, LibraryUser, Loan, Receipt, SessionState } from '../types/library'
import { addDaysIso, LOAN_DAYS, todayIso } from '../utils/dates'
import { loadLibrary, saveLibrary } from '../utils/storage'
import { clean, isEmail, key } from '../utils/normalizers'
import { LibraryContext } from './LibraryContextObject'

export interface LibraryContextValue {
  state: LibraryState
  session: SessionState
  storageError: string | null
  loginAdmin: () => void
  loginUser: (userId: string) => void
  logout: () => void
  addCategory: (name: string) => ActionResult
  updateCategory: (id: string, name: string) => ActionResult
  deleteCategory: (id: string) => ActionResult
  addBook: (book: Omit<Book, 'id'>) => ActionResult
  updateBook: (book: Book) => ActionResult
  deleteBook: (id: string) => ActionResult
  addUser: (user: Omit<LibraryUser, 'id'>) => ActionResult
  requestLoan: (bookId: string) => ActionResult
  returnLoan: (loanId: string) => ActionResult
  getReceipt: (id: string) => Receipt | undefined
}


function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function loanCode(existing: Loan[]): string {
  let code = ''
  do {
    code = `PR-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  } while (existing.some((loan) => loan.code === code))
  return code
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const loaded = useMemo(() => loadLibrary(), [])
  const [state, setState] = useState<LibraryState>(loaded.state)
  const [session, setSession] = useState<SessionState>({ role: null, userId: null })
  const [storageError, setStorageError] = useState<string | null>(loaded.error ?? null)

  function commit(next: LibraryState, success: string, id?: string): ActionResult {
    const saved = saveLibrary(next)
    if (!saved.ok) {
      setStorageError(saved.error ?? 'No se pudo guardar la operacion.')
      return { ok: false, message: saved.error ?? 'No se pudo guardar la operacion.' }
    }
    setState(next)
    setStorageError(null)
    return { ok: true, message: success, id }
  }

  const value: LibraryContextValue = {
    state,
    session,
    storageError,
    loginAdmin: () => setSession({ role: 'admin', userId: null }),
    loginUser: (userId) => setSession({ role: 'user', userId }),
    logout: () => setSession({ role: null, userId: null }),
    addCategory: (name) => {
      const cleanName = clean(name)
      if (!cleanName) return { ok: false, message: 'Ingrese el nombre de la categoria.' }
      if (state.categories.some((cat) => key(cat.name) === key(cleanName))) return { ok: false, message: 'Ya existe una categoria con ese nombre.' }
      return commit({ ...state, categories: [...state.categories, { id: uid('cat'), name: cleanName }] }, 'Categoria registrada.')
    },
    updateCategory: (id, name) => {
      const cleanName = clean(name)
      if (!cleanName) return { ok: false, message: 'Ingrese el nombre de la categoria.' }
      if (state.categories.some((cat) => cat.id !== id && key(cat.name) === key(cleanName))) return { ok: false, message: 'Ya existe una categoria con ese nombre.' }
      return commit({ ...state, categories: state.categories.map((cat) => (cat.id === id ? { ...cat, name: cleanName } : cat)) }, 'Categoria actualizada.')
    },
    deleteCategory: (id) => {
      if (state.books.some((book) => book.categoryId === id)) return { ok: false, message: 'No se puede eliminar una categoria utilizada por libros.' }
      return commit({ ...state, categories: state.categories.filter((cat) => cat.id !== id) }, 'Categoria eliminada.')
    },
    addBook: (book) => {
      const nextBook = { ...book, id: uid('book'), title: clean(book.title), author: clean(book.author), isbn: clean(book.isbn) }
      const validation = validateBook(nextBook, state)
      if (!validation.ok) return validation
      return commit({ ...state, books: [...state.books, nextBook] }, 'Libro registrado.')
    },
    updateBook: (book) => {
      const nextBook = { ...book, title: clean(book.title), author: clean(book.author), isbn: clean(book.isbn) }
      const validation = validateBook(nextBook, state, book.id)
      if (!validation.ok) return validation
      return commit({ ...state, books: state.books.map((item) => (item.id === book.id ? nextBook : item)) }, 'Libro actualizado.')
    },
    deleteBook: (id) => {
      if (state.loans.some((loan) => loan.bookId === id && loan.status === 'Activo')) return { ok: false, message: 'No se puede eliminar un libro con prestamos activos.' }
      return commit({ ...state, books: state.books.filter((book) => book.id !== id) }, 'Libro eliminado.')
    },
    addUser: (user) => {
      const nextUser = {
        ...user,
        id: uid('user'),
        fullName: clean(user.fullName),
        universityCode: clean(user.universityCode),
        email: clean(user.email),
        username: clean(user.username),
        password: user.password.trim(),
      }
      if (!nextUser.fullName) return { ok: false, message: 'Ingrese nombres y apellidos.' }
      if (!nextUser.universityCode) return { ok: false, message: 'Ingrese el codigo universitario.' }
      if (!isEmail(nextUser.email)) return { ok: false, message: 'Ingrese un correo electronico valido.' }
      if (!nextUser.username) return { ok: false, message: 'Ingrese el usuario de acceso.' }
      if (!nextUser.password) return { ok: false, message: 'Ingrese la contrasena de acceso.' }
      if (state.users.some((item) => key(item.universityCode) === key(nextUser.universityCode))) return { ok: false, message: 'Ya existe un usuario con ese codigo universitario.' }
      if (state.users.some((item) => key(item.username) === key(nextUser.username))) return { ok: false, message: 'Ya existe un usuario de acceso con ese nombre.' }
      return commit({ ...state, users: [...state.users, nextUser] }, 'Usuario registrado.', nextUser.id)
    },
    requestLoan: (bookId) => {
      if (session.role !== 'user' || !session.userId) return { ok: false, message: 'Debe seleccionar un usuario registrado.' }
      const book = state.books.find((item) => item.id === bookId)
      const user = state.users.find((item) => item.id === session.userId)
      if (!book || !user) return { ok: false, message: 'No se encontro el usuario o libro seleccionado.' }
      if (book.stock <= 0) return { ok: false, message: 'El libro no tiene stock disponible.' }
      if (state.loans.some((loan) => loan.userId === user.id && loan.bookId === book.id && loan.status === 'Activo')) {
        return { ok: false, message: 'Este usuario ya tiene un prestamo activo de este libro.' }
      }
      const loanDate = todayIso()
      const code = loanCode(state.loans)
      const loanId = uid('loan')
      const receiptId = uid('receipt')
      const dueDate = addDaysIso(loanDate, LOAN_DAYS)
      const loan: Loan = {
        id: loanId,
        code,
        userId: user.id,
        bookId: book.id,
        userFullNameSnapshot: user.fullName,
        bookTitleSnapshot: book.title,
        loanDate,
        dueDate,
        status: 'Activo',
        receiptId,
      }
      const receipt: Receipt = { id: receiptId, loanId, userFullName: user.fullName, bookTitle: book.title, loanDate, dueDate, loanCode: code }
      return commit({
        ...state,
        books: state.books.map((item) => (item.id === bookId ? { ...item, stock: item.stock - 1 } : item)),
        loans: [...state.loans, loan],
        receipts: [...state.receipts, receipt],
      }, 'Prestamo registrado y comprobante generado.', receiptId)
    },
    returnLoan: (loanId) => {
      const loan = state.loans.find((item) => item.id === loanId)
      if (!loan) return { ok: false, message: 'No se encontro el prestamo.' }
      if (loan.status === 'Devuelto') return { ok: false, message: 'Este prestamo ya fue devuelto.' }
      return commit({
        ...state,
        loans: state.loans.map((item) => (item.id === loanId ? { ...item, status: 'Devuelto', returnedDate: todayIso() } : item)),
        books: state.books.map((book) => (book.id === loan.bookId ? { ...book, stock: book.stock + 1 } : book)),
      }, 'Devolucion registrada.')
    },
    getReceipt: (id) => state.receipts.find((receipt) => receipt.id === id),
  }

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

function validateBook(book: Book, state: LibraryState, editingId?: string): ActionResult {
  if (!book.title) return { ok: false, message: 'Ingrese el titulo.' }
  if (!book.author) return { ok: false, message: 'Ingrese el autor.' }
  if (!book.isbn) return { ok: false, message: 'Ingrese el ISBN.' }
  if (!state.categories.some((cat) => cat.id === book.categoryId)) return { ok: false, message: 'Seleccione una categoria existente.' }
  if (!Number.isInteger(book.stock) || book.stock < 0) return { ok: false, message: 'El stock debe ser un entero mayor o igual que cero.' }
  if (state.books.some((item) => item.id !== editingId && key(item.isbn) === key(book.isbn))) return { ok: false, message: 'Ya existe un libro con ese ISBN.' }
  return { ok: true, message: 'Valido.' }
}
