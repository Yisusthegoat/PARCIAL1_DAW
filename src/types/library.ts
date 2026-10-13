export type Role = 'admin' | 'user'
export type UserType = 'Estudiante' | 'Docente'
export type LoanStatus = 'Activo' | 'Devuelto'

export interface Category {
  id: string
  name: string
}

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  categoryId: string
  stock: number
}

export interface LibraryUser {
  id: string
  fullName: string
  universityCode: string
  email: string
  username: string
  password: string
  type: UserType
}

export interface Receipt {
  id: string
  loanId: string
  userFullName: string
  bookTitle: string
  loanDate: string
  dueDate: string
  loanCode: string
}

export interface Loan {
  id: string
  code: string
  userId: string
  bookId: string
  userFullNameSnapshot: string
  bookTitleSnapshot: string
  loanDate: string
  dueDate: string
  returnedDate?: string
  status: LoanStatus
  receiptId: string
}

export interface LibraryState {
  categories: Category[]
  books: Book[]
  users: LibraryUser[]
  loans: Loan[]
  receipts: Receipt[]
}

export interface SessionState {
  role: Role | null
  userId: string | null
}

export interface PersistedLibrary {
  version: number
  state: LibraryState
}

export interface ActionResult {
  ok: boolean
  message: string
  id?: string
}
