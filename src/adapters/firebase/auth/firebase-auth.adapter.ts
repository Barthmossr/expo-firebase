import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  fetchSignInMethodsForEmail as firebaseFetchSignInMethodsForEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  GoogleAuthProvider,
} from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import type { AuthPort } from '@/core/ports/auth'
import type {
  AuthUser,
  AuthCredentials,
  RegisterCredentials,
  SignInMethodsResult,
  SignInMethod,
} from '@/core/ports/auth'
import {
  mapFirebaseUser,
  createAuthError,
  ensureUserExists,
} from './firebase-auth.utils'
import { getActionCodeSettings } from './firebase-auth.constants'
import { getLoggerService } from '@/services/logger'

const createFirebaseAuthAdapter = (): AuthPort => {
  const authInstance = getAuth()
  const logger = getLoggerService()

  const signIn = async (credentials: AuthCredentials): Promise<AuthUser> => {
    logger.debug('signIn: attempting email/password sign in', {
      email: credentials.email,
    })
    try {
      const result = await signInWithEmailAndPassword(
        authInstance,
        credentials.email,
        credentials.password,
      )
      const user = mapFirebaseUser(result.user)
      if (!user) {
        logger.error('signIn: user mapping returned null')
        throw createAuthError({ code: 'auth/unknown' })
      }
      logger.debug('signIn: success', { userId: user.id })
      return user
    } catch (error) {
      logger.error('signIn: failed', { email: credentials.email, error })
      throw createAuthError(error)
    }
  }

  const signUp = async (
    credentials: RegisterCredentials,
  ): Promise<AuthUser> => {
    logger.debug('signUp: attempting registration', {
      email: credentials.email,
    })
    try {
      const result = await createUserWithEmailAndPassword(
        authInstance,
        credentials.email,
        credentials.password,
      )
      await firebaseUpdateProfile(result.user, {
        displayName: credentials.displayName,
      })
      const user = ensureUserExists(mapFirebaseUser(result.user))
      logger.debug('signUp: success', { userId: user.id })
      return {
        id: user.id,
        email: user.email,
        displayName: credentials.displayName,
        photoUrl: user.photoUrl,
        emailVerified: user.emailVerified,
      }
    } catch (error) {
      logger.error('signUp: failed', { email: credentials.email, error })
      throw createAuthError(error)
    }
  }

  const signInWithGoogle = async (): Promise<AuthUser> => {
    logger.debug('signInWithGoogle: attempting Google sign in')
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const response = await GoogleSignin.signIn()
      if (!response.data?.idToken) {
        logger.error('signInWithGoogle: no idToken received')
        throw createAuthError({ code: 'auth/popup-closed-by-user' })
      }
      const credential = GoogleAuthProvider.credential(response.data.idToken)
      const result = await signInWithCredential(authInstance, credential)
      const user = mapFirebaseUser(result.user)
      if (!user) {
        logger.error('signInWithGoogle: user mapping returned null')
        throw createAuthError({ code: 'auth/unknown' })
      }
      logger.debug('signInWithGoogle: success', { userId: user.id })
      return user
    } catch (error) {
      logger.error('signInWithGoogle: failed', { error })
      throw createAuthError(error)
    }
  }

  const signOut = async (): Promise<void> => {
    logger.debug('signOut: attempting sign out')
    try {
      const isGoogleSignedIn = await GoogleSignin.getCurrentUser()
      if (isGoogleSignedIn) {
        logger.debug('signOut: signing out from Google')
        await GoogleSignin.signOut()
      }
      await firebaseSignOut(authInstance)
      logger.debug('signOut: success')
    } catch (error) {
      logger.error('signOut: failed', { error })
      throw createAuthError(error)
    }
  }

  const getCurrentUser = (): AuthUser | null => {
    const user = mapFirebaseUser(authInstance.currentUser)
    logger.debug('getCurrentUser', { userId: user?.id ?? null })
    return user
  }

  const onAuthStateChanged = (
    callback: (user: AuthUser | null) => void,
  ): (() => void) => {
    return firebaseOnAuthStateChanged(authInstance, (firebaseUser) => {
      const user = mapFirebaseUser(firebaseUser)
      logger.debug('onAuthStateChanged', { userId: user?.id ?? null })
      callback(user)
    })
  }

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    logger.debug('sendPasswordResetEmail: attempting', { email })
    try {
      await firebaseSendPasswordResetEmail(
        authInstance,
        email,
        getActionCodeSettings(),
      )
      logger.debug('sendPasswordResetEmail: success', { email })
    } catch (error) {
      logger.error('sendPasswordResetEmail: failed', { email, error })
      throw createAuthError(error)
    }
  }

  const confirmPasswordReset = async (
    code: string,
    newPassword: string,
  ): Promise<void> => {
    logger.debug('confirmPasswordReset: attempting')
    try {
      await firebaseConfirmPasswordReset(authInstance, code, newPassword)
      logger.debug('confirmPasswordReset: success')
    } catch (error) {
      logger.error('confirmPasswordReset: failed', { error })
      throw createAuthError(error)
    }
  }

  const verifyPasswordResetCode = async (code: string): Promise<string> => {
    logger.debug('verifyPasswordResetCode: attempting')
    try {
      const email = await firebaseVerifyPasswordResetCode(authInstance, code)
      logger.debug('verifyPasswordResetCode: success', { email })
      return email
    } catch (error) {
      logger.error('verifyPasswordResetCode: failed', { error })
      throw createAuthError(error)
    }
  }

  const updateProfile = async (data: Partial<AuthUser>): Promise<void> => {
    logger.debug('updateProfile: attempting', { data })
    try {
      const currentUser = authInstance.currentUser
      if (!currentUser) {
        logger.error('updateProfile: no current user')
        throw createAuthError({ code: 'auth/user-not-found' })
      }
      await firebaseUpdateProfile(currentUser, {
        displayName: data.displayName ?? undefined,
        photoURL: data.photoUrl ?? undefined,
      })
      logger.debug('updateProfile: success')
    } catch (error) {
      logger.error('updateProfile: failed', { error })
      throw createAuthError(error)
    }
  }

  const createUserAfterVerification = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<AuthUser> => {
    logger.debug('createUserAfterVerification: attempting', { email })
    try {
      const result = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password,
      )
      await firebaseUpdateProfile(result.user, { displayName })
      const user = ensureUserExists(mapFirebaseUser(result.user))
      logger.debug('createUserAfterVerification: success', { userId: user.id })
      return {
        id: user.id,
        email: user.email,
        displayName,
        photoUrl: user.photoUrl,
        emailVerified: user.emailVerified,
      }
    } catch (error) {
      logger.error('createUserAfterVerification: failed', { email, error })
      throw createAuthError(error)
    }
  }

  const fetchSignInMethodsForEmail = async (
    email: string,
  ): Promise<SignInMethodsResult> => {
    logger.debug('fetchSignInMethodsForEmail: checking', { email })
    try {
      const methods = await firebaseFetchSignInMethodsForEmail(
        authInstance,
        email,
      )
      const typedMethods = methods as SignInMethod[]
      const hasPassword = typedMethods.includes('password')
      const hasOAuth = typedMethods.some((method) => method === 'google.com')

      logger.debug('fetchSignInMethodsForEmail: found methods', {
        email,
        methods: typedMethods,
      })
      return {
        methods: typedMethods,
        hasPassword,
        hasOAuth,
      }
    } catch (error) {
      logger.warn('fetchSignInMethodsForEmail: failed, returning empty', {
        email,
        error,
      })
      return {
        methods: [],
        hasPassword: false,
        hasOAuth: false,
      }
    }
  }

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    getCurrentUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    confirmPasswordReset,
    verifyPasswordResetCode,
    updateProfile,
    createUserAfterVerification,
    fetchSignInMethodsForEmail,
  }
}

export { createFirebaseAuthAdapter }
