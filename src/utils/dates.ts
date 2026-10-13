export const LOAN_DAYS = 7

export function todayIso(): string {
  return new Date().toISOString()
}

export function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(isoDate)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function formatDate(isoDate?: string): string {
  if (!isoDate) return '-'
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
}
