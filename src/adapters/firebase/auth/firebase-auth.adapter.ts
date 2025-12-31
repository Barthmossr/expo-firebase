import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import type { AuthPort } from '@/core/ports/auth'
import type {
  AuthUser,
  AuthCredentials,
  RegisterCredentials,
} from '@/core/ports/auth'
import { mapFirebaseUser, createAuthError } from './firebase-auth.utils'

const createFirebaseAuthAdapter = (): AuthPort => {
  const signIn = async (credentials: AuthCredentials): Promise<AuthUser> => {
    try {
      const result = await auth().signInWithEmailAndPassword(
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
      const result = await auth().createUserWithEmailAndPassword(
        credentials.email,
        credentials.password,
      )
      await result.user.updateProfile({ displayName: credentials.displayName })
      const user = mapFirebaseUser(result.user)
      if (!user) {
        throw createAuthError({ code: 'auth/unknown' })
      }
      return { ...user, displayName: credentials.displayName }
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
      const credential = auth.GoogleAuthProvider.credential(
        response.data.idToken,
      )
      const result = await auth().signInWithCredential(credential)
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
      await auth().signOut()
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const getCurrentUser = (): AuthUser | null => {
    return mapFirebaseUser(auth().currentUser)
  }

  const onAuthStateChanged = (
    callback: (user: AuthUser | null) => void,
  ): (() => void) => {
    return auth().onAuthStateChanged((firebaseUser) => {
      callback(mapFirebaseUser(firebaseUser))
    })
  }

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      await auth().sendPasswordResetEmail(email)
    } catch (error) {
      throw createAuthError(error)
    }
  }

  const updateProfile = async (data: Partial<AuthUser>): Promise<void> => {
    try {
      const currentUser = auth().currentUser
      if (!currentUser) {
        throw createAuthError({ code: 'auth/user-not-found' })
      }
      await currentUser.updateProfile({
        displayName: data.displayName ?? undefined,
        photoURL: data.photoUrl ?? undefined,
      })
    } catch (error) {
      throw createAuthError(error)
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
    updateProfile,
  }
}

export { createFirebaseAuthAdapter }
