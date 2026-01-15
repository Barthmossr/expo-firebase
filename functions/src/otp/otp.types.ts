type PendingRegistration = {
  email: string
  displayName: string
  password: string
  otpHash: string
  otpExpiresAt: FirebaseFirestore.Timestamp
  failedAttempts: number
  resendCount: number
  lastResendAt: FirebaseFirestore.Timestamp
  createdAt: FirebaseFirestore.Timestamp
}

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

export type {
  PendingRegistration,
  SendOTPRequest,
  VerifyOTPRequest,
  OTPVerificationResult,
}
