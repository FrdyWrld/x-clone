import type { AuthAction, AuthState } from '../types/AuthReducerInterfaces'

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'login':
      return { logged: true, user: action.payload }
    case 'logout':
      return { logged: false, user: null }
    default:
      return state
  }
}
