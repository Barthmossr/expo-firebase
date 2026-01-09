import {
  validatePasswordProvider,
  validatePasswordReset,
} from '@/flows/auth/utils/provider-validation.utils'
import type { SignInMethodsResult } from '@/core/ports/auth'

describe('provider-validation.utils', () => {
  describe('validatePasswordProvider', () => {
    it('should allow password login when user does not exist', () => {
      const signInMethods: SignInMethodsResult = {
        methods: [],
        hasPassword: false,
        hasOAuth: false,
      }

      const result = validatePasswordProvider(signInMethods)

      expect(result).toEqual({
        canUsePassword: true,
        shouldUseOAuth: false,
        message: null,
      })
    })

    it('should allow password login when user has password provider', () => {
      const signInMethods: SignInMethodsResult = {
        methods: ['password'],
        hasPassword: true,
        hasOAuth: false,
      }

      const result = validatePasswordProvider(signInMethods)

      expect(result).toEqual({
        canUsePassword: true,
        shouldUseOAuth: false,
        message: null,
      })
    })

    it('should allow password login when user has both providers', () => {
      const signInMethods: SignInMethodsResult = {
        methods: ['password', 'google.com'],
        hasPassword: true,
        hasOAuth: true,
      }

      const result = validatePasswordProvider(signInMethods)

      expect(result).toEqual({
        canUsePassword: true,
        shouldUseOAuth: false,
        message: null,
      })
    })

    it('should block password login for OAuth-only users', () => {
      const signInMethods: SignInMethodsResult = {
        methods: ['google.com'],
        hasPassword: false,
        hasOAuth: true,
      }

      const result = validatePasswordProvider(signInMethods)

      expect(result).toEqual({
        canUsePassword: false,
        shouldUseOAuth: true,
        message:
          'This account uses Google Sign-In. Please use "Sign in with Google" button.',
      })
    })
  })

  describe('validatePasswordReset', () => {
    it('should block reset when user does not exist', () => {
      const signInMethods: SignInMethodsResult = {
        methods: [],
        hasPassword: false,
        hasOAuth: false,
      }

      const result = validatePasswordReset(signInMethods)

      expect(result).toEqual({
        canUsePassword: false,
        shouldUseOAuth: false,
        message: 'No account found with this email address.',
      })
    })

    it('should allow reset when user has password provider', () => {
      const signInMethods: SignInMethodsResult = {
        methods: ['password'],
        hasPassword: true,
        hasOAuth: false,
      }

      const result = validatePasswordReset(signInMethods)

      expect(result).toEqual({
        canUsePassword: true,
        shouldUseOAuth: false,
        message: null,
      })
    })

    it('should allow reset when user has both providers', () => {
      const signInMethods: SignInMethodsResult = {
        methods: ['password', 'google.com'],
        hasPassword: true,
        hasOAuth: true,
      }

      const result = validatePasswordReset(signInMethods)

      expect(result).toEqual({
        canUsePassword: true,
        shouldUseOAuth: false,
        message: null,
      })
    })
  })
})
