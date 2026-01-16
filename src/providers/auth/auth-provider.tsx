import { createContext, useState, useEffect, useCallback } from 'react'
import { getAuthService } from '@/services/auth'
import { getOTPService } from '@/services/otp'
import { initializeGoogleSignIn } from '@/config/auth'
import { getLoggerService } from '@/services/logger'
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
  const logger = getLoggerService()

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

  const signIn = useCallback(
    async (credentials: AuthCredentials) => {
      logger.info('User attempting sign in', { email: credentials.email })
      setError(null)
      setIsLoading(true)
      try {
        const authService = getAuthService()
        await authService.signIn(credentials)
        logger.info('User signed in successfully')
      } catch (err) {
        logger.error('Sign in failed', { error: err })
        setError(err as AuthError)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [logger],
  )

  const signUp = useCallback(
    async (credentials: RegisterCredentials) => {
      logger.info('User attempting sign up', { email: credentials.email })
      setError(null)
      setIsLoading(true)
      try {
        const authService = getAuthService()
        await authService.signUp(credentials)
        logger.info('User signed up successfully')
      } catch (err) {
        logger.error('Sign up failed', { error: err })
        setError(err as AuthError)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [logger],
  )

  const signInWithGoogle = useCallback(async () => {
    logger.info('User attempting Google sign in')
    setError(null)
    setIsLoading(true)
    try {
      const authService = getAuthService()
      await authService.signInWithGoogle()
      logger.info('Google sign in successful')
    } catch (err) {
      logger.error('Google sign in failed', { error: err })
      setError(err as AuthError)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [logger])

  const signOut = useCallback(async () => {
    logger.info('User attempting sign out')
    setError(null)
    try {
      const authService = getAuthService()
      await authService.signOut()
      logger.info('User signed out successfully')
    } catch (err) {
      logger.error('Sign out failed', { error: err })
      setError(err as AuthError)
      throw err
    }
  }, [logger])

  const sendPasswordResetEmail = useCallback(
    async (email: string) => {
      logger.info('Password reset requested', { email })
      setError(null)
      try {
        const authService = getAuthService()
        await authService.sendPasswordResetEmail(email)
        logger.info('Password reset email sent')
      } catch (err) {
        logger.error('Password reset failed', { email, error: err })
        setError(err as AuthError)
        throw err
      }
    },
    [logger],
  )

  const verifyEmailAndRegister = useCallback(
    async (email: string, code: string) => {
      logger.info('Email verification started', { email })
      setError(null)
      setIsLoading(true)
      try {
        const otpService = getOTPService()
        const verificationResult = await otpService.verifyCode({
          email,
          code,
        })

        if (!verificationResult.success) {
          logger.error('Email verification failed', {
            email,
            error: verificationResult.error,
          })
          throw new Error(verificationResult.error || 'Verification failed')
        }

        if (
          !verificationResult.email ||
          !verificationResult.password ||
          !verificationResult.displayName
        ) {
          logger.error('Invalid verification result', { email })
          throw new Error('Invalid verification result')
        }

        const authService = getAuthService()
        await authService.createUserAfterVerification(
          verificationResult.email,
          verificationResult.password,
          verificationResult.displayName,
        )
        logger.info('User registered after email verification', { email })
      } catch (err) {
        logger.error('Registration after verification failed', {
          email,
          error: err,
        })
        setError(err as AuthError)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [logger],
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
