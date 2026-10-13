import { jsPDF } from 'jspdf'
import type { Receipt } from '../types/library'
import { formatDate } from './dates'

export function downloadReceiptPdf(receipt: Receipt): void {
  const doc = new jsPDF()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('UNCP - Comprobante de prestamo', 20, 24)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.text(`Codigo: ${receipt.loanCode}`, 20, 42)
  doc.text(`Usuario: ${receipt.userFullName}`, 20, 54)
  doc.text(`Libro: ${receipt.bookTitle}`, 20, 66)
  doc.text(`Fecha de prestamo: ${formatDate(receipt.loanDate)}`, 20, 78)
  doc.text(`Fecha limite de devolucion: ${formatDate(receipt.dueDate)}`, 20, 90)
  doc.text('Biblioteca Universitaria UNCP - acceso local de demostracion', 20, 112)
  doc.save(`comprobante-${receipt.loanCode}.pdf`)
}
