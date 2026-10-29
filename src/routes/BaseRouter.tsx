import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../auth/pages/LoginPage'
import { RegisterPage } from '../auth/pages/RegisterPage'
import { HomePage } from '../pages/HomePage'
import { ComposePage } from '../pages/ComposePage'
import { FeedPage } from '../pages/FeedPage'
import { FollowingPage } from '../pages/FollowingPage'
import { FollowersPage } from '../pages/FollowersPage'
import { UserTweetsPage } from '../pages/UserTweetsPage'
import { NavBar } from '../ui/components/NavBar'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'

const Layout = () => (
  <div className="min-vh-100 bg-body-tertiary">
    <NavBar />
    <main className="pb-5">
      <Outlet />
    </main>
  </div>
)

export const BaseRouter = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="compose" element={<ComposePage />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="following" element={<FollowingPage />} />
        <Route path="followers" element={<FollowersPage />} />
        <Route path="users/:username" element={<UserTweetsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)