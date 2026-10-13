import { Link, useParams } from 'react-router-dom'
import { ReceiptCard } from '../components/ReceiptCard'
import { useLibrary } from '../context/useLibrary'

export function ReceiptPage() {
  const { id } = useParams()
  const { getReceipt, session, state } = useLibrary()
  const receipt = id ? getReceipt(id) : undefined
  const loan = receipt ? state.loans.find((item) => item.id === receipt.loanId) : undefined
  const allowed = session.role === 'admin' || (session.role === 'user' && loan?.userId === session.userId)

  return (
    <section className="page">
      <h1>Comprobante</h1>
      {!receipt || !allowed ? <section className="panel"><p className="empty">Comprobante no disponible para esta sesion.</p><Link to="/acceso">Volver al acceso</Link></section> : <ReceiptCard receipt={receipt} />}
    </section>
  )
}
