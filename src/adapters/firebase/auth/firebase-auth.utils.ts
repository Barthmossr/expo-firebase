import type { FirebaseAuthTypes } from '@react-native-firebase/auth'
import type { AuthUser, AuthErrorCode, AuthError } from '@/core/ports/auth'

const mapFirebaseUser = (
  firebaseUser: FirebaseAuthTypes.User | null,
): AuthUser | null => {
  if (!firebaseUser) {
    return null
  }

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoUrl: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
  }
}

const mapFirebaseErrorCode = (code: string): AuthErrorCode => {
  const knownCodes: AuthErrorCode[] = [
    'auth/email-already-in-use',
    'auth/invalid-email',
    'auth/user-not-found',
    'auth/wrong-password',
    'auth/weak-password',
    'auth/too-many-requests',
    'auth/network-request-failed',
    'auth/popup-closed-by-user',
    'auth/invalid-credential',
  ]

  return knownCodes.includes(code as AuthErrorCode)
    ? (code as AuthErrorCode)
    : 'auth/unknown'
}

const createAuthError = (error: unknown): AuthError => {
  const firebaseError = error as { code?: string; message?: string }
  const code = mapFirebaseErrorCode(firebaseError.code ?? '')
  const message = firebaseError.message ?? 'An unknown error occurred'

  return { code, message }
}

const ensureUserExists = (user: AuthUser | null): AuthUser => {
  if (!user) {
    throw createAuthError({ code: 'auth/unknown' })
  }
  return user
}

export {
  mapFirebaseUser,
  mapFirebaseErrorCode,
  createAuthError,
  ensureUserExists,
}
