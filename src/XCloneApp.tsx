import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/contexts/AuthProvider'
import { SocialProvider } from './social/SocialProvider'
import { BaseRouter } from './routes/BaseRouter'

export const XCloneApp = () => (
  <BrowserRouter>
    <AuthProvider>
      <SocialProvider>
        <BaseRouter />
      </SocialProvider>
    </AuthProvider>
  </BrowserRouter>
)