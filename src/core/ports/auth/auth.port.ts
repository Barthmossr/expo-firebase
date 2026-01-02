import type {
  AuthUser,
  AuthCredentials,
  RegisterCredentials,
} from './auth.types'

type AuthPort = {
  signIn: (credentials: AuthCredentials) => Promise<AuthUser>
  signUp: (credentials: RegisterCredentials) => Promise<AuthUser>
  signInWithGoogle: () => Promise<AuthUser>
  signOut: () => Promise<void>
  getCurrentUser: () => AuthUser | null
  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => () => void
  sendPasswordResetEmail: (email: string) => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
}

export type { AuthPort }
