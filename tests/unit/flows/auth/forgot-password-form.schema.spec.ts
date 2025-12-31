import { forgotPasswordSchema } from '@/flows/auth/components/forgot-password-form'

describe('forgotPasswordSchema', () => {
  it('should validate correct email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'test@example.com',
    })

    expect(result.success).toBe(true)
  })
})
