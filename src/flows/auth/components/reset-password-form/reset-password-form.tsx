import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/components/ui/text-input'
import { Button } from '@/components/ui/button'
import { getAuthService } from '@/services/auth'
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from './reset-password-form.schema'
import type { ResetPasswordFormProps } from './reset-password-form.types'
import { styles } from './reset-password-form.styles'

const ResetPasswordForm = (
  props: ResetPasswordFormProps,
): React.ReactElement => {
  const { code, email, onSuccess, onCancel } = props
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const authService = getAuthService()
      await authService.confirmPasswordReset(code, data.password)
      setIsSuccess(true)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to reset password'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <Text style={styles.successTitle}>Password Changed!</Text>
        <Text style={styles.successMessage}>
          Your password has been successfully changed. You can now login with
          your new password.
        </Text>
        <Button title="Back to Login" onPress={onSuccess} variant="secondary" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>Enter your new password below.</Text>
      <Text style={styles.emailText}>{email}</Text>

      <Controller
        control={form.control}
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="New Password"
            placeholder="Enter new password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
      <Text style={styles.passwordHint}>
        Must be at least 8 characters with 1 uppercase and 1 number
      </Text>

      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Confirm Password"
            placeholder="Confirm new password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      {error && <Text style={styles.apiError}>{error}</Text>}

      <Button
        title="Reset Password"
        onPress={form.handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
      />

      <Pressable onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </View>
  )
}

export { ResetPasswordForm }
