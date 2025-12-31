import { z } from 'zod'

const PASSWORD_MIN_LENGTH = 8

const registerSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(
      PASSWORD_MIN_LENGTH,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    )
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export { registerSchema, PASSWORD_MIN_LENGTH }
export type { RegisterFormData }
