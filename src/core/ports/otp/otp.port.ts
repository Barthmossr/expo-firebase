import type {
  SendOTPRequest,
  VerifyOTPRequest,
  OTPVerificationResult,
} from './otp.types'

type OTPPort = {
  sendVerificationCode: (data: SendOTPRequest) => Promise<void>
  verifyCode: (data: VerifyOTPRequest) => Promise<OTPVerificationResult>
  resendCode: (data: { email: string }) => Promise<void>
}

export type { OTPPort }
