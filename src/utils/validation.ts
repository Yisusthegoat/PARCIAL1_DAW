export const LIMITS = {
  categoryNameMax: 60,
  bookTitleMax: 120,
  authorMax: 90,
  isbnMax: 20,
  stockMax: 999,
  fullNameMax: 100,
  universityCodeMax: 30,
  emailMax: 120,
  usernameMin: 4,
  usernameMax: 30,
  passwordMin: 6,
  passwordMax: 40,
}

export function hasValidIsbnChars(value: string): boolean {
  return /^[0-9Xx-]+$/.test(value.trim())
}

export function hasValidUsernameChars(value: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(value.trim())
}
