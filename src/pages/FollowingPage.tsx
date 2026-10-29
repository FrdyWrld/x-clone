import { useState } from 'react'
import { users } from '../data/mockData'
import { useSocial } from '../social/useSocial'
import { paginate } from '../helpers/paginate'
import { UserCard } from '../ui/components/UserCard'
import { Pagination } from '../ui/components/Pagination'

export const FollowingPage = () => {
  const { followingIds } = useSocial()
  const [page, setPage] = useState(1)

  const list = users
    .filter((u) => followingIds.includes(u.id))
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'es'))

  const result = paginate(list, page)

  return (
    <section className="container py-4" style={{ maxWidth: 640 }}>
      <header className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
        <h1 className="h4 fw-bold mb-0">Usuarios que sigues</h1>
        <span className="badge text-bg-primary rounded-pill">{result.total}</span>
      </header>

      {result.items.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-person-plus display-4 d-block mb-3"></i>
          <p className="mb-0">Todavía no sigues a nadie.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {result.items.map((u) => (
            <UserCard key={u.id} user={u} />
          ))}
        </div>
      )}

      {result.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination page={result.page} totalPages={result.totalPages} onChange={setPage} />
        </div>
      )}
    </section>
  )
}