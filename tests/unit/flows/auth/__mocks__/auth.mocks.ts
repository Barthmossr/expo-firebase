import type { AuthContextValue } from '@/providers/auth'

const createMockAuthContext = (): AuthContextValue => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signInWithGoogle: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  verifyEmailAndRegister: jest.fn(),
  clearError: jest.fn(),
})

export { createMockAuthContext }
