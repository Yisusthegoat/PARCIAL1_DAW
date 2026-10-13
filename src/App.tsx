import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LibraryProvider } from './context/LibraryContext'
import { AccessPage } from './pages/AccessPage'
import { AdminLoansPage } from './pages/AdminLoansPage'
import { BooksPage } from './pages/BooksPage'
import { CatalogPage } from './pages/CatalogPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ReceiptPage } from './pages/ReceiptPage'
import { UserLoansPage } from './pages/UserLoansPage'
import { UsersPage } from './pages/UsersPage'

function App() {
  return (
    <LibraryProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/acceso" replace />} />
          <Route path="/acceso" element={<AccessPage />} />
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/categorias" element={<CategoriesPage />} />
            <Route path="/admin/libros" element={<BooksPage />} />
            <Route path="/admin/usuarios" element={<UsersPage />} />
            <Route path="/admin/prestamos" element={<AdminLoansPage />} />
          </Route>
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/mis-prestamos" element={<UserLoansPage onlyActive />} />
            <Route path="/historial" element={<UserLoansPage onlyActive={false} />} />
          </Route>
          <Route path="/comprobante/:id" element={<ReceiptPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </LibraryProvider>
  )
}

export default App
