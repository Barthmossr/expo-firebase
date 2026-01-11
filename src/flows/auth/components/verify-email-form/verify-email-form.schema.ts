import { z } from 'zod'

const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
})

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>

export { verifyEmailSchema }
export type { VerifyEmailFormData }
