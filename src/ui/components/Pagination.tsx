interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export const Pagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Paginación">
      <ul className="pagination pagination-sm align-items-center mb-0">
        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link rounded-start-pill px-3"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
          >
            <i className="bi bi-chevron-left me-1" aria-hidden="true"></i>
            Anterior
          </button>
        </li>

        <li className="page-item disabled">
          <span className="page-link text-body bg-transparent">
            Página {page} de {totalPages}
          </span>
        </li>

        <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link rounded-end-pill px-3"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
          >
            Siguiente
            <i className="bi bi-chevron-right ms-1" aria-hidden="true"></i>
          </button>
        </li>
      </ul>
    </nav>
  )
}