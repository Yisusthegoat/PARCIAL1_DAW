export function Notice({ message, type = 'info' }: { message: string | null; type?: 'info' | 'success' | 'error' }) {
  if (!message) return null
  return <p className={`notice ${type}`}>{message}</p>
}
