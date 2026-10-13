export function clean(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function key(value: string): string {
  return clean(value).toLocaleUpperCase('es-PE')
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value))
}
