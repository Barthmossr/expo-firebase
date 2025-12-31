import { getAuthErrorMessage } from '@/flows/auth/utils/auth-error-messages'
import type { AuthErrorCode } from '@/core/ports/auth'

describe('getAuthErrorMessage', () => {
  it('should return correct message for email-already-in-use', () => {
    const message = getAuthErrorMessage('auth/email-already-in-use')

    expect(message).toBe('This email is already registered')
  })
})
