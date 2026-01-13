import {
  getFunctions,
  httpsCallableFromUrl,
} from '@react-native-firebase/functions'
import type {
  OTPPort,
  SendOTPRequest,
  VerifyOTPRequest,
  OTPVerificationResult,
} from '@/core/ports/otp'
import { getFirebaseConfig } from '@/config/firebase'

const createFirebaseOTPAdapter = (): OTPPort => {
  const config = getFirebaseConfig()
  const region = config.region ?? 'southamerica-east1'
  const projectId = config.projectId
  const functionsInstance = getFunctions()

  const sendVerificationCode = async (data: SendOTPRequest): Promise<void> => {
    const callable = httpsCallableFromUrl(
      functionsInstance,
      `https://${region}-${projectId}.cloudfunctions.net/sendOTPEmail`,
    )
    await callable(data)
  }

  const verifyCode = async (
    data: VerifyOTPRequest,
  ): Promise<OTPVerificationResult> => {
    const callable = httpsCallableFromUrl<
      VerifyOTPRequest,
      OTPVerificationResult
    >(
      functionsInstance,
      `https://${region}-${projectId}.cloudfunctions.net/verifyOTPEmail`,
    )
    const result = await callable(data)
    return result.data
  }

  const resendCode = async (data: { email: string }): Promise<void> => {
    const callable = httpsCallableFromUrl(
      functionsInstance,
      `https://${region}-${projectId}.cloudfunctions.net/sendOTPEmail`,
    )
    await callable({ email: data.email, resend: true })
  }

  return {
    sendVerificationCode,
    verifyCode,
    resendCode,
  }
}

export { createFirebaseOTPAdapter }
