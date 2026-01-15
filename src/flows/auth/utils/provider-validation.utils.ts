import type { SignInMethodsResult } from '@/core/ports/auth'
import type { ProviderValidationResult } from './provider-validation.types'

const validatePasswordProvider = (
  signInMethods: SignInMethodsResult,
): ProviderValidationResult => {
  if (signInMethods.methods.length === 0) {
    return {
      canUsePassword: true,
      shouldUseOAuth: false,
      message: null,
    }
  }

  if (signInMethods.hasOAuth && !signInMethods.hasPassword) {
    return {
      canUsePassword: false,
      shouldUseOAuth: true,
      message:
        'This account uses Google Sign-In. Please use "Sign in with Google" button.',
    }
  }

  return {
    canUsePassword: true,
    shouldUseOAuth: false,
    message: null,
  }
}

const validatePasswordReset = (
  signInMethods: SignInMethodsResult,
): ProviderValidationResult => {
  if (signInMethods.methods.length === 0) {
    return {
      canUsePassword: false,
      shouldUseOAuth: false,
      message: 'No account found with this email address.',
    }
  }

  if (signInMethods.hasOAuth && !signInMethods.hasPassword) {
    return {
      canUsePassword: false,
      shouldUseOAuth: true,
      message:
        'This account uses Google Sign-In and does not have a password. Please use "Sign in with Google".',
    }
  }

  if (!signInMethods.hasPassword) {
    return {
      canUsePassword: false,
      shouldUseOAuth: false,
      message: 'This account does not have a password set.',
    }
  }

  return {
    canUsePassword: true,
    shouldUseOAuth: false,
    message: null,
  }
}

export { validatePasswordProvider, validatePasswordReset }
