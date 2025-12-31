import { loginSchema } from '@/flows/auth/components/login-form'

describe('loginSchema', () => {
  it('should validate correct email and password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.success).toBe(true)
  })

  it('should fail when email is empty', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Email is required')
    }
  })

  it('should fail when email is invalid', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Please enter a valid email address',
      )
    }
  })
})
