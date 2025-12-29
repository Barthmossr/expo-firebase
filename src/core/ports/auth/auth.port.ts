import type { AuthUser, AuthCredentials } from './auth.types'

type AuthPort = {
  signIn: (credentials: AuthCredentials) => Promise<AuthUser>
  signUp: (credentials: AuthCredentials) => Promise<AuthUser>
  signOut: () => Promise<void>
  getCurrentUser: () => AuthUser | null
  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => () => void
  sendPasswordResetEmail: (email: string) => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
}

export type { AuthPort }
