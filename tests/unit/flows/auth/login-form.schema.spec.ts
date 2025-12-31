import { loginSchema } from '@/flows/auth/components/login-form'

describe('loginSchema', () => {
  it('should validate correct email and password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.success).toBe(true)
  })
})
