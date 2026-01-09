import { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { StyleSheet } from 'react-native'
import { COLORS, TYPOGRAPHY } from '@/theme'
import { getAuthService } from '@/services/auth'
import { AuthScreen } from '@/flows/auth/screens/auth-screen'

const ResetPasswordScreen = (): React.ReactElement => {
  const { oobCode } = useLocalSearchParams<{ oobCode?: string }>()
  const [email, setEmail] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode || typeof oobCode !== 'string') {
        setError('Invalid or missing reset code')
        setIsVerifying(false)
        return
      }

      try {
        const authService = getAuthService()
        const verifiedEmail = await authService.verifyPasswordResetCode(oobCode)
        setEmail(verifiedEmail)
      } catch {
        setError('This reset link is invalid or has expired')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyCode()
  }, [oobCode])

  if (isVerifying) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent.primary} />
        <Text style={styles.loadingText}>Verifying reset link...</Text>
      </View>
    )
  }

  if (error || !email || !oobCode) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Invalid Link</Text>
        <Text style={styles.errorMessage}>
          {error || 'This reset link is invalid or has expired'}
        </Text>
        <Text
          style={styles.backLink}
          onPress={() => router.replace('/(auth)/login')}
        >
          Back to Login
        </Text>
      </View>
    )
  }

  return (
    <AuthScreen
      initialView="reset-password"
      resetCode={oobCode}
      resetEmail={email}
    />
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    gap: 16,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    paddingHorizontal: 24,
    gap: 16,
  },
  errorTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
  },
  errorMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  backLink: {
    ...TYPOGRAPHY.body,
    color: COLORS.accent.primary,
    marginTop: 16,
  },
})

export default ResetPasswordScreen
