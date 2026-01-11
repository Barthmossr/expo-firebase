import { useState } from 'react'
import { View, Text } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/components/ui/text-input'
import { Button } from '@/components/ui/button'
import { getOTPService } from '@/services/otp'
import { registerSchema, type RegisterFormData } from './register-form.schema'
import type { RegisterFormProps } from './register-form.types'
import { styles } from './register-form.styles'

const RegisterForm = (props: RegisterFormProps): React.ReactElement => {
  const { onSuccess } = props
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const otpService = getOTPService()
      await otpService.sendVerificationCode({
        email: data.email,
        displayName: data.displayName,
        password: data.password,
      })

      if (onSuccess) {
        onSuccess(data.email)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send verification code'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Controller
        control={form.control}
        name="displayName"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Name"
            placeholder="Enter your name"
            autoCapitalize="words"
            autoComplete="name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
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
      <Controller
        control={form.control}
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
      <Text style={styles.passwordHint}>
        Min 8 characters, 1 uppercase, 1 number
      </Text>
      {error && <Text style={styles.apiError}>{error}</Text>}
      <Button
        title="Create Account"
        onPress={form.handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
      />
    </View>
  )
}

export { RegisterForm }
