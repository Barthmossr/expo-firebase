import { registerSchema } from '@/flows/auth/components/register-form'

describe('registerSchema', () => {
  const validData = {
    displayName: 'John Doe',
    email: 'test@example.com',
    password: 'Password1',
  }

  it('should validate correct registration data', () => {
    const result = registerSchema.safeParse(validData)

    expect(result.success).toBe(true)
  })
})
