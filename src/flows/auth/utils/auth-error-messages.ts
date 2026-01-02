import type { AuthErrorCode } from '@/core/ports/auth'

const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  'auth/email-already-in-use': 'This email is already registered',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/weak-password': 'Password is too weak',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Check your connection',
  'auth/popup-closed-by-user': 'Sign-in was cancelled',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/unknown': 'Something went wrong. Please try again',
}

const getAuthErrorMessage = (code: AuthErrorCode): string => {
  return AUTH_ERROR_MESSAGES[code] ?? AUTH_ERROR_MESSAGES['auth/unknown']
}

export { getAuthErrorMessage, AUTH_ERROR_MESSAGES }
