import { Link } from 'react-router-dom'
import { useLibrary } from '../context/useLibrary'
import { formatDate } from '../utils/dates'

export function UserLoansPage({ onlyActive }: { onlyActive: boolean }) {
  const { state, session } = useLibrary()
  const loans = state.loans.filter((loan) => loan.userId === session.userId && (!onlyActive || loan.status === 'Activo'))

  return (
    <section className="page">
      <h1>{onlyActive ? 'Mis prestamos activos' : 'Historial de prestamos'}</h1>
      <section className="panel">
        {loans.length === 0 ? <p className="empty">No hay prestamos para mostrar.</p> : (
          <div className="table-wrap"><table><thead><tr><th>Libro</th><th>Prestamo</th><th>Limite</th><th>Devolucion real</th><th>Estado</th><th>Comprobante</th></tr></thead><tbody>
            {loans.map((loan) => <tr key={loan.id}><td>{loan.bookTitleSnapshot}</td><td>{formatDate(loan.loanDate)}</td><td>{formatDate(loan.dueDate)}</td><td>{formatDate(loan.returnedDate)}</td><td>{loan.status}</td><td><Link to={`/comprobante/${loan.receiptId}`}>Consultar</Link></td></tr>)}
          </tbody></table></div>
        )}
      </section>
    </section>
  )
}
