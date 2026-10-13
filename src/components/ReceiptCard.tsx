import type { Receipt } from '../types/library'
import { formatDate } from '../utils/dates'
import { downloadReceiptPdf } from '../utils/pdf'

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  return (
    <article className="receipt">
      <h3>Comprobante digital</h3>
      <dl>
        <div><dt>Usuario</dt><dd>{receipt.userFullName}</dd></div>
        <div><dt>Libro</dt><dd>{receipt.bookTitle}</dd></div>
        <div><dt>Fecha de prestamo</dt><dd>{formatDate(receipt.loanDate)}</dd></div>
        <div><dt>Fecha limite</dt><dd>{formatDate(receipt.dueDate)}</dd></div>
        <div><dt>Codigo</dt><dd>{receipt.loanCode}</dd></div>
      </dl>
      <button type="button" onClick={() => downloadReceiptPdf(receipt)}>Descargar PDF</button>
    </article>
  )
}
