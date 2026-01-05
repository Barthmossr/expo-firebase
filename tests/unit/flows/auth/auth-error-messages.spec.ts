import { getAuthErrorMessage } from '@/flows/auth/utils'
import type { AuthErrorCode } from '@/core/ports/auth'

describe('getAuthErrorMessage', () => {
  it('should return correct message for email-already-in-use', () => {
    const message = getAuthErrorMessage('auth/email-already-in-use')

    expect(message).toBe('This email is already registered')
  })

  it('should return correct message for invalid-email', () => {
    const message = getAuthErrorMessage('auth/invalid-email')

    expect(message).toBe('Please enter a valid email address')
  })

  it('should return correct message for user-not-found', () => {
    const message = getAuthErrorMessage('auth/user-not-found')

    expect(message).toBe('No account found with this email')
  })

  it('should return correct message for wrong-password', () => {
    const message = getAuthErrorMessage('auth/wrong-password')

    expect(message).toBe('Incorrect password')
  })

  it('should return correct message for invalid-credential', () => {
    const message = getAuthErrorMessage('auth/invalid-credential')

    expect(message).toBe('Invalid email or password')
  })

  it('should return correct message for too-many-requests', () => {
    const message = getAuthErrorMessage('auth/too-many-requests')

    expect(message).toBe('Too many attempts. Please try again later')
  })

  it('should return default message for unknown error', () => {
    const message = getAuthErrorMessage('auth/unknown')

    expect(message).toBe('Something went wrong. Please try again')
  })

  it('should return default message for unrecognized error code', () => {
    const message = getAuthErrorMessage('auth/unknown' as AuthErrorCode)

    expect(message).toBe('Something went wrong. Please try again')
  })

  it('should return default message for code not in record', () => {
    const message = getAuthErrorMessage(
      'auth/some-random-code' as AuthErrorCode,
    )

    expect(message).toBe('Something went wrong. Please try again')
  })
})
