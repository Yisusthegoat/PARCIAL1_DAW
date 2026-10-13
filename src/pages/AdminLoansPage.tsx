import { Link } from 'react-router-dom'
import { Notice } from '../components/Notice'
import { useLibrary } from '../context/useLibrary'
import { formatDate } from '../utils/dates'
import { useState } from 'react'

export function AdminLoansPage() {
  const { state, returnLoan } = useLibrary()
  const [message, setMessage] = useState<string | null>(null)

  return (
    <section className="page">
      <h1>Prestamos</h1>
      <Notice message={message} type={message?.includes('registrada') ? 'success' : 'error'} />
      <section className="panel">
        {state.loans.length === 0 ? <p className="empty">No hay prestamos registrados.</p> : (
          <div className="table-wrap"><table><thead><tr><th>Usuario</th><th>Libro</th><th>Codigo</th><th>Prestamo</th><th>Limite</th><th>Devolucion</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
            {state.loans.map((loan) => <tr key={loan.id}><td>{loan.userFullNameSnapshot}</td><td>{loan.bookTitleSnapshot}</td><td>{loan.code}</td><td>{formatDate(loan.loanDate)}</td><td>{formatDate(loan.dueDate)}</td><td>{formatDate(loan.returnedDate)}</td><td>{loan.status}</td><td className="actions"><Link to={`/comprobante/${loan.receiptId}`}>Comprobante</Link><button type="button" disabled={loan.status === 'Devuelto'} onClick={() => setMessage(returnLoan(loan.id).message)}>Registrar devolucion</button></td></tr>)}
          </tbody></table></div>
        )}
      </section>
    </section>
  )
}
