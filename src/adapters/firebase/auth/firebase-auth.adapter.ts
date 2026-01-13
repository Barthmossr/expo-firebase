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

const createFirebaseAuthAdapter = (): AuthPort => {
  const authInstance = getAuth()

  const signIn = async (credentials: AuthCredentials): Promise<AuthUser> => {
    try {
      const result = await signInWithEmailAndPassword(
        authInstance,
        credentials.email,
        credentials.password,
      )
      const user = mapFirebaseUser(result.user)
      if (!user) {
        throw createAuthError({ code: 'auth/unknown' })
      }
      return user
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const signUp = async (
    credentials: RegisterCredentials,
  ): Promise<AuthUser> => {
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
      return {
        id: user.id,
        email: user.email,
        displayName: credentials.displayName,
        photoUrl: user.photoUrl,
        emailVerified: user.emailVerified,
      }
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const signInWithGoogle = async (): Promise<AuthUser> => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const response = await GoogleSignin.signIn()
      if (!response.data?.idToken) {
        throw createAuthError({ code: 'auth/popup-closed-by-user' })
      }
      const credential = GoogleAuthProvider.credential(response.data.idToken)
      const result = await signInWithCredential(authInstance, credential)
      const user = mapFirebaseUser(result.user)
      if (!user) {
        throw createAuthError({ code: 'auth/unknown' })
      }
      return user
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      const isGoogleSignedIn = await GoogleSignin.getCurrentUser()
      if (isGoogleSignedIn) {
        await GoogleSignin.signOut()
      }
      await firebaseSignOut(authInstance)
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const getCurrentUser = (): AuthUser | null => {
    return mapFirebaseUser(authInstance.currentUser)
  }

  const onAuthStateChanged = (
    callback: (user: AuthUser | null) => void,
  ): (() => void) => {
    return firebaseOnAuthStateChanged(authInstance, (firebaseUser) => {
      callback(mapFirebaseUser(firebaseUser))
    })
  }

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      await firebaseSendPasswordResetEmail(
        authInstance,
        email,
        getActionCodeSettings(),
      )
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const confirmPasswordReset = async (
    code: string,
    newPassword: string,
  ): Promise<void> => {
    try {
      await firebaseConfirmPasswordReset(authInstance, code, newPassword)
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const verifyPasswordResetCode = async (code: string): Promise<string> => {
    try {
      const email = await firebaseVerifyPasswordResetCode(authInstance, code)
      return email
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const updateProfile = async (data: Partial<AuthUser>): Promise<void> => {
    try {
      const currentUser = authInstance.currentUser
      if (!currentUser) {
        throw createAuthError({ code: 'auth/user-not-found' })
      }
      await firebaseUpdateProfile(currentUser, {
        displayName: data.displayName ?? undefined,
        photoURL: data.photoUrl ?? undefined,
      })
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const createUserAfterVerification = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<AuthUser> => {
    try {
      const result = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password,
      )
      await firebaseUpdateProfile(result.user, { displayName })
      const user = ensureUserExists(mapFirebaseUser(result.user))
      return {
        id: user.id,
        email: user.email,
        displayName,
        photoUrl: user.photoUrl,
        emailVerified: user.emailVerified,
      }
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const fetchSignInMethodsForEmail = async (
    email: string,
  ): Promise<SignInMethodsResult> => {
    try {
      const methods = await firebaseFetchSignInMethodsForEmail(
        authInstance,
        email,
      )
      const typedMethods = methods as SignInMethod[]
      const hasPassword = typedMethods.includes('password')
      const hasOAuth = typedMethods.some((method) => method === 'google.com')

      return {
        methods: typedMethods,
        hasPassword,
        hasOAuth,
      }
    } catch {
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
