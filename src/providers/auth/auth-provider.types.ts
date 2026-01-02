import type { ReactNode } from 'react'
import type {
  AuthUser,
  AuthCredentials,
  RegisterCredentials,
  AuthError,
} from '@/core/ports/auth'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (credentials: AuthCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  sendPasswordResetEmail: (email: string) => Promise<void>
  error: AuthError | null
  clearError: () => void
}

type AuthProviderProps = {
  children: ReactNode
}

export type { AuthContextValue, AuthProviderProps }
