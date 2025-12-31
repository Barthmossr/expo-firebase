import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/components/ui/text-input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from './forgot-password-form.schema'
import type { ForgotPasswordFormProps } from './forgot-password-form.types'
import { getAuthErrorMessage } from '../../utils/auth-error-messages'

const ForgotPasswordForm = (
  props: ForgotPasswordFormProps,
): React.ReactElement => {
  const { onBack } = props
  const { sendPasswordResetEmail, isLoading, error } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await sendPasswordResetEmail(data.email)
      setIsSuccess(true)
    } catch {
      // Error is handled by AuthProvider
    }
  }

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <Text style={styles.successTitle}>Check your email</Text>
        <Text style={styles.successMessage}>
          We sent a password reset link to your email address.
        </Text>
        <Button title="Back to Login" onPress={onBack} variant="secondary" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we will send you a reset link.
      </Text>
      <Controller
        control={form.control}
        name="email"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
      {error && (
        <Text style={styles.apiError}>{getAuthErrorMessage(error.code)}</Text>
      )}
      <Button
        title="Send Reset Link"
        onPress={form.handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
      />
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  apiError: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.status.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
  },
  backButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.accent.primary,
  },
  successTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  successMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
})

export { ForgotPasswordForm }
