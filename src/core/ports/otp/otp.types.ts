type SendOTPRequest = {
  email: string
  displayName: string
  password: string
}

type VerifyOTPRequest = {
  email: string
  code: string
}

type OTPVerificationResult = {
  success: boolean
  email?: string
  displayName?: string
  password?: string
  error?: string
}

export type { SendOTPRequest, VerifyOTPRequest, OTPVerificationResult }
