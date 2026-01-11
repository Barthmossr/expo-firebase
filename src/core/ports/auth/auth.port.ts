import type {
  AuthUser,
  AuthCredentials,
  RegisterCredentials,
  SignInMethodsResult,
} from './auth.types'

type AuthPort = {
  signIn: (credentials: AuthCredentials) => Promise<AuthUser>
  signUp: (credentials: RegisterCredentials) => Promise<AuthUser>
  signInWithGoogle: () => Promise<AuthUser>
  signOut: () => Promise<void>
  getCurrentUser: () => AuthUser | null
  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => () => void
  sendPasswordResetEmail: (email: string) => Promise<void>
  confirmPasswordReset: (code: string, newPassword: string) => Promise<void>
  verifyPasswordResetCode: (code: string) => Promise<string>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
  createUserAfterVerification: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<AuthUser>
  fetchSignInMethodsForEmail: (email: string) => Promise<SignInMethodsResult>
}

export type { AuthPort }
