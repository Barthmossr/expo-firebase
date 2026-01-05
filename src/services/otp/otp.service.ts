import type { OTPPort } from '@/core/ports/otp'
import { createFirebaseOTPAdapter } from '@/adapters/firebase/otp'

let otpInstance: OTPPort | null = null

const getOTPService = (): OTPPort => {
  if (!otpInstance) {
    otpInstance = createFirebaseOTPAdapter()
  }
  return otpInstance
}

const resetOTPService = (): void => {
  otpInstance = null
}

export { getOTPService, resetOTPService }
