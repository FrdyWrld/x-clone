export const PAGE_SIZE = 10

export interface PaginatedResult<T> {
  items: T[]
  page: number
  totalPages: number
  total: number
}

/**
 * Paginates an in-memory list. Maximum 10 items per page by default.
 */
export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = PAGE_SIZE,
): PaginatedResult<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    total,
  }
}
