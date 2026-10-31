import { Link } from "react-router-dom";
import type { UserProfile } from "../../types/social";

interface Props {
  user: UserProfile;
  showFollow?: boolean;
  following?: boolean;
  onFollow?: (id: number) => void;
}

export const UserCard = ({ user, showFollow, following, onFollow }: Props) => (
  <div className="card shadow-sm border-0">
    <div className="card-body d-flex align-items-center gap-3 py-3">
      <div
        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
        style={{ width: 48, height: 48 }}
        aria-hidden="true"
      >
        {user.fullName.charAt(0).toUpperCase()}
      </div>

      <Link
        to={`/users/${user.username}`}
        className="text-decoration-none text-reset flex-grow-1 lh-sm"
      >
        <div className="fw-semibold">{user.fullName}</div>
        <small className="text-muted">@{user.username}</small>
      </Link>

      {showFollow && !following && (
        <button
          type="button"
          className="btn btn-primary btn-sm rounded-pill px-3"
          onClick={() => onFollow?.(user.id)}
        >
          Seguir
        </button>
      )}
    </div>
  </div>
);