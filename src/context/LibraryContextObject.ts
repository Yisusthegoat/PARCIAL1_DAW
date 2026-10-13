import { createContext } from 'react'
import type { LibraryContextValue } from './LibraryContext'

export const LibraryContext = createContext<LibraryContextValue | null>(null)
