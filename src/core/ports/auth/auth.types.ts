type AuthUser = {
  id: string
  email: string | null
  displayName: string | null
  photoUrl: string | null
  emailVerified: boolean
}

type AuthCredentials = {
  email: string
  password: string
}

type RegisterCredentials = AuthCredentials & {
  displayName: string
}

type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/weak-password'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/popup-closed-by-user'
  | 'auth/invalid-credential'
  | 'auth/unknown'

type AuthError = {
  code: AuthErrorCode
  message: string
}

export type {
  AuthUser,
  AuthCredentials,
  RegisterCredentials,
  AuthState,
  AuthErrorCode,
  AuthError,
}
