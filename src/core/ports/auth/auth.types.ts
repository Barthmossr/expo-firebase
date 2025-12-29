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

type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type { AuthUser, AuthCredentials, AuthState }
