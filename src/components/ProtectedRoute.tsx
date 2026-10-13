import { Navigate, Outlet } from 'react-router-dom'
import type { Role } from '../types/library'
import { useLibrary } from '../context/useLibrary'

export function ProtectedRoute({ role }: { role: Role }) {
  const { session } = useLibrary()
  if (session.role !== role) return <Navigate to="/acceso" replace />
  if (role === 'user' && !session.userId) return <Navigate to="/acceso" replace />
  return <Outlet />
}
