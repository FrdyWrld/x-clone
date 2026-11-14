import type { AuthAction, AuthState } from '../types/AuthReducerInterfaces'

export const initialAuthState: AuthState = { checking: true, logged: false, user: null }

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'login':
      return { checking: false, logged: true, user: action.payload }
    case 'logout':
      return { checking: false, logged: false, user: null }
    default:
      return state
  }
}
