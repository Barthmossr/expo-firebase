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

  describe('displayName validation', () => {
    it('should fail when name is empty', () => {
      const result = registerSchema.safeParse({ ...validData, displayName: '' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Name is required')
      }
    })

    it('should fail when name is too short', () => {
      const result = registerSchema.safeParse({
        ...validData,
        displayName: 'A',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Name must be at least 2 characters',
        )
      }
    })
  })
})
