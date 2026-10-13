import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useLibrary } from '../context/useLibrary'
import { Notice } from './Notice'

export function Layout() {
  const { session, state, logout, storageError } = useLibrary()
  const navigate = useNavigate()
  const location = useLocation()
  const activeUser = state.users.find((user) => user.id === session.userId)

  function closeSession() {
    logout()
    navigate('/acceso')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to={session.role === 'admin' ? '/admin/libros' : '/catalogo'}>
          <span className="brand-mark">UN</span>
          <span>Biblioteca UNCP</span>
        </Link>
        <nav className="nav">
          {!session.role && location.pathname !== '/acceso' && <NavLink to="/acceso">Acceso</NavLink>}
          {session.role === 'admin' && (
            <>
              <NavLink to="/admin/categorias">Categorias</NavLink>
              <NavLink to="/admin/libros">Libros</NavLink>
              <NavLink to="/admin/usuarios">Usuarios</NavLink>
              <NavLink to="/admin/prestamos">Prestamos</NavLink>
            </>
          )}
          {session.role === 'user' && (
            <>
              <NavLink to="/catalogo">Catalogo</NavLink>
              <NavLink to="/mis-prestamos">Mis prestamos</NavLink>
              <NavLink to="/historial">Historial</NavLink>
            </>
          )}
        </nav>
        {session.role && (
          <button className="ghost" type="button" onClick={closeSession}>
            Salir {activeUser ? `- ${activeUser.fullName}` : '- Admin'}
          </button>
        )}
      </header>
      <main>
        <Notice message={storageError} type="error" />
        <Outlet />
      </main>
    </div>
  )
}
