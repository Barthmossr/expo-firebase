import { useState, useEffect, useCallback } from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { useAuth } from '@/hooks/auth'
import { getOTPService } from '@/services/otp'
import { OTPInput } from '@/components/ui/otp-input'
import type { VerifyEmailFormProps } from './verify-email-form.types'
import { styles } from './verify-email-form.styles'

const RESEND_COOLDOWN = 60

const VerifyEmailForm = (props: VerifyEmailFormProps): React.ReactElement => {
  const { email, onBack, onVerificationSuccess } = props
  const { verifyEmailAndRegister, isLoading, error, clearError } = useAuth()

  const [code, setCode] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
    return undefined
  }, [resendCooldown])

  const handleVerify = useCallback(
    async (verificationCode: string): Promise<void> => {
      if (verificationCode.length !== 6) return
      if (isVerifying || isLoading) return

      setIsVerifying(true)
      clearError()

      try {
        await verifyEmailAndRegister(email, verificationCode)
        onVerificationSuccess()
      } catch (err) {
        setCode('')
      } finally {
        setIsVerifying(false)
      }
    },
    [
      email,
      isVerifying,
      isLoading,
      verifyEmailAndRegister,
      onVerificationSuccess,
      clearError,
    ],
  )

  const handleCodeChange = useCallback(
    (newCode: string): void => {
      setCode(newCode)
      if (error) {
        clearError()
      }
    },
    [error, clearError],
  )

  const handleResend = useCallback(async (): Promise<void> => {
    if (resendCooldown > 0) return

    setResendError(null)
    clearError()

    try {
      const otpService = getOTPService()
      await otpService.resendCode({ email })
      setResendCooldown(RESEND_COOLDOWN)
      setCode('')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to resend code'
      setResendError(errorMessage)
    }
  }, [resendCooldown, email, clearError])

  const handleBack = useCallback((): void => {
    clearError()
    onBack()
  }, [onBack, clearError])

  const canResend = resendCooldown === 0
  const showStatus = isVerifying || isLoading

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.description}>
          We sent a 6-digit verification code to your email. Enter it below to
          verify your account.
        </Text>
      </View>

      <View style={styles.otpSection}>
        <OTPInput
          value={code}
          onChange={handleCodeChange}
          onComplete={handleVerify}
          error={!!error || !!resendError}
          disabled={isVerifying || isLoading}
        />

        {showStatus && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.statusText}>Verifying...</Text>
          </View>
        )}

        {error && !showStatus && (
          <Text style={styles.error}>{error.message}</Text>
        )}
        {resendError && !showStatus && (
          <Text style={styles.error}>{resendError}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <Pressable onPress={handleResend} disabled={!canResend}>
            <Text
              style={[
                styles.resendButton,
                !canResend && styles.resendButtonDisabled,
              ]}
            >
              {canResend ? 'Resend Code' : `Resend in ${resendCooldown}s`}
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back to registration</Text>
        </Pressable>
      </View>
    </View>
  )
}

export { VerifyEmailForm }
