import { useContext } from 'react'
import { LibraryContext } from './LibraryContextObject'

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary debe usarse dentro de LibraryProvider')
  return context
}
