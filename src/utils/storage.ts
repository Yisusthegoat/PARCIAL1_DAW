import type { LibraryState, PersistedLibrary } from '../types/library'

const STORAGE_KEY = 'biblioteca-universitaria:v1'
const VERSION = 1

export const demoState: LibraryState = {
  categories: [
    { id: 'cat-literatura', name: 'Literatura' },
    { id: 'cat-ciencias', name: 'Ciencias' },
    { id: 'cat-tecnologia', name: 'Tecnologia' },
  ],
  books: [
    { id: 'book-1', title: 'Cien anos de soledad', author: 'Gabriel Garcia Marquez', isbn: '9780307474728', categoryId: 'cat-literatura', stock: 4 },
    { id: 'book-2', title: 'Fisica universitaria', author: 'Sears y Zemansky', isbn: '9786073221245', categoryId: 'cat-ciencias', stock: 2 },
    { id: 'book-3', title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', categoryId: 'cat-tecnologia', stock: 3 },
    { id: 'book-4', title: 'Introduccion a los algoritmos', author: 'Cormen, Leiserson, Rivest y Stein', isbn: '9780262033848', categoryId: 'cat-tecnologia', stock: 1 },
    { id: 'book-5', title: 'Biologia', author: 'Campbell', isbn: '9780321775658', categoryId: 'cat-ciencias', stock: 0 },
    { id: 'book-6', title: 'La ciudad y los perros', author: 'Mario Vargas Llosa', isbn: '9788432216485', categoryId: 'cat-literatura', stock: 5 },
  ],
  users: [
    { id: 'user-estudiante', fullName: 'Ana Torres Ruiz', universityCode: 'EST-001', email: 'ana.torres@universidad.edu', username: 'ana.torres', password: 'uncp2026', type: 'Estudiante' },
    { id: 'user-docente', fullName: 'Carlos Mendoza Vega', universityCode: 'DOC-001', email: 'carlos.mendoza@universidad.edu', username: 'carlos.mendoza', password: 'uncp2026', type: 'Docente' },
  ],
  loans: [],
  receipts: [],
}

export function loadLibrary(): { state: LibraryState; error?: string } {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { state: demoState }

  try {
    const persisted = JSON.parse(raw) as PersistedLibrary
    if (!persisted.state) {
      return { state: demoState, error: 'El almacenamiento local tiene una version no compatible. Se cargaron datos demo.' }
    }
    return { state: normalizeState(persisted.state) }
  } catch {
    return { state: demoState, error: 'No se pudo leer el almacenamiento local. El JSON esta danado y se cargaron datos demo.' }
  }
}

function normalizeState(state: LibraryState): LibraryState {
  return {
    ...state,
    users: state.users.map((user) => ({
      ...user,
      username: user.username ?? demoUsername(user.id, user.universityCode),
      password: user.password ?? 'uncp2026',
    })),
  }
}

function demoUsername(id: string, universityCode: string): string {
  if (id === 'user-estudiante') return 'ana.torres'
  if (id === 'user-docente') return 'carlos.mendoza'
  return universityCode.toLocaleLowerCase('es-PE').replace(/\s+/g, '')
}

export function saveLibrary(state: LibraryState): { ok: boolean; error?: string } {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, state }))
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se pudo guardar en Local Storage. Revise el espacio disponible o los permisos del navegador.' }
  }
}
