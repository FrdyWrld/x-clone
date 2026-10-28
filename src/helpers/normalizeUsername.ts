/**
 * Converts free text into a valid username:
 * lowercase, no accents, no spaces (spaces become underscores).
 */
export const normalizeUsername = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')