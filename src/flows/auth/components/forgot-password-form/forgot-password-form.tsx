import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/components/ui/text-input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from './forgot-password-form.schema'
import type { ForgotPasswordFormProps } from './forgot-password-form.types'
import { getAuthErrorMessage } from '../../utils/auth-error-messages'
import { styles } from './forgot-password-form.styles'

const ForgotPasswordForm = (
  props: ForgotPasswordFormProps,
): React.ReactElement => {
  const { onBack } = props
  const { sendPasswordResetEmail, isLoading, error } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)
  const [providerMessage, setProviderMessage] = useState<string | null>(null)
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setProviderMessage(null)
      await sendPasswordResetEmail(data.email)
      setIsSuccess(true)
    } catch (err) {
      const error = err as { code?: string }
      if (error.code === 'auth/user-not-found') {
        setProviderMessage(
          'No account found. If you signed up with Google, you cannot reset a password.',
        )
      }
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
      {providerMessage && (
        <Text style={styles.apiError}>{providerMessage}</Text>
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

export { ForgotPasswordForm }
