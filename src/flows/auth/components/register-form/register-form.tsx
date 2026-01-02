import { View, Text, StyleSheet } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/components/ui/text-input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'
import { registerSchema, type RegisterFormData } from './register-form.schema'
import type { RegisterFormProps } from './register-form.types'
import { getAuthErrorMessage } from '../../utils/auth-error-messages'

const RegisterForm = (_props: RegisterFormProps): React.ReactElement => {
  const { signUp, isLoading, error } = useAuth()
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data)
    } catch {
      // Error is handled by AuthProvider
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
      <Text style={styles.passwordHint}>
        Min 8 characters, 1 uppercase, 1 number
      </Text>
      {error && (
        <Text style={styles.apiError}>{getAuthErrorMessage(error.code)}</Text>
      )}
      <Button
        title="Create Account"
        onPress={form.handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  passwordHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.lg,
  },
  apiError: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.status.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
})

export { RegisterForm }
