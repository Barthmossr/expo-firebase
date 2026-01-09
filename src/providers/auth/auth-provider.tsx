import { createContext, useState, useEffect, useCallback } from 'react'
import { getAuthService } from '@/services/auth'
import { getOTPService } from '@/services/otp'
import { initializeGoogleSignIn } from '@/config/auth'
import type {
  AuthUser,
  AuthCredentials,
  RegisterCredentials,
  AuthError,
  SignInMethodsResult,
} from '@/core/ports/auth'
import type { AuthContextValue, AuthProviderProps } from './auth-provider.types'

const AuthContext = createContext<AuthContextValue | null>(null)

const AuthProvider = ({ children }: AuthProviderProps): React.ReactElement => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    initializeGoogleSignIn()
    const authService = getAuthService()
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    setError(null)
    setIsLoading(true)
    try {
      const authService = getAuthService()
      await authService.signIn(credentials)
    } catch (err) {
      setError(err as AuthError)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = useCallback(async (credentials: RegisterCredentials) => {
    setError(null)
    setIsLoading(true)
    try {
      const authService = getAuthService()
      await authService.signUp(credentials)
    } catch (err) {
      setError(err as AuthError)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      const authService = getAuthService()
      await authService.signInWithGoogle()
    } catch (err) {
      setError(err as AuthError)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    try {
      const authService = getAuthService()
      await authService.signOut()
    } catch (err) {
      setError(err as AuthError)
      throw err
    }
  }, [])

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    setError(null)
    try {
      const authService = getAuthService()
      await authService.sendPasswordResetEmail(email)
    } catch (err) {
      setError(err as AuthError)
      throw err
    }
  }, [])

  const verifyEmailAndRegister = useCallback(
    async (email: string, code: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const otpService = getOTPService()
        const verificationResult = await otpService.verifyCode({
          email,
          code,
        })

        if (!verificationResult.success) {
          throw new Error(verificationResult.error || 'Verification failed')
        }

        if (
          !verificationResult.email ||
          !verificationResult.password ||
          !verificationResult.displayName
        ) {
          throw new Error('Invalid verification result')
        }

        const authService = getAuthService()
        await authService.createUserAfterVerification(
          verificationResult.email,
          verificationResult.password,
          verificationResult.displayName,
        )
      } catch (err) {
        setError(err as AuthError)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const fetchSignInMethodsForEmail = useCallback(
    async (email: string): Promise<SignInMethodsResult> => {
      try {
        const authService = getAuthService()
        return await authService.fetchSignInMethodsForEmail(email)
      } catch (err) {
        setError(err as AuthError)
        throw err
      }
    },
    [],
  )

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordResetEmail,
    verifyEmailAndRegister,
    fetchSignInMethodsForEmail,
    error,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
