import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="page">
      <h1>Pagina no encontrada</h1>
      <section className="panel">
        <p>La ruta solicitada no existe.</p>
        <Link to="/acceso">Volver al acceso</Link>
      </section>
    </section>
  )
}
