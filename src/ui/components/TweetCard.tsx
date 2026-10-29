import { Link } from 'react-router-dom'
import type { Tweet, UserProfile } from '../../types/social'
import { formatDate } from '../../helpers/formatDate'

interface Props {
  tweet: Tweet
  author?: Pick<UserProfile, 'fullName' | 'username'>
}

export const TweetCard = ({ tweet, author }: Props) => (
  <article className="card shadow-sm border-0">
    <div className="card-body">
      <div className="d-flex gap-3">
        {author && (
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
            style={{ width: 48, height: 48 }}
            aria-hidden="true"
          >
            {author.fullName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-grow-1 min-w-0">
          <header className="small mb-1">
            {author && (
              <>
                <Link
                  to={`/users/${author.username}`}
                  className="text-decoration-none text-reset"
                >
                  <strong>{author.fullName}</strong>
                  <span className="text-muted">, @{author.username}</span>
                </Link>
                <span className="text-muted"> - </span>
              </>
            )}
            <time className="text-muted">{formatDate(tweet.createdAt)}</time>
          </header>

          <p className="mb-0" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {tweet.text}
          </p>
        </div>
      </div>
    </div>
  </article>
)