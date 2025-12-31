import { forgotPasswordSchema } from '@/flows/auth/components/forgot-password-form'

describe('forgotPasswordSchema', () => {
  it('should validate correct email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'test@example.com',
    })

    expect(result.success).toBe(true)
  })

  it('should fail when email is empty', () => {
    const result = forgotPasswordSchema.safeParse({
      email: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Email is required')
    }
  })

  it('should fail when email is invalid', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'invalid-email',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Please enter a valid email address',
      )
    }
  })
})
