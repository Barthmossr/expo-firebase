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
  })
})
