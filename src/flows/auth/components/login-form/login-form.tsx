import { View, Text, Pressable } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/components/ui/text-input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { loginSchema, type LoginFormData } from './login-form.schema'
import type { LoginFormProps } from './login-form.types'
import { getAuthErrorMessage } from '../../utils/auth-error-messages'
import { styles } from './login-form.styles'

const LoginForm = ({
  onForgotPassword,
}: LoginFormProps): React.ReactElement => {
  const { signIn, isLoading, error } = useAuth()
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data)
    } catch {
      // Error is handled by AuthProvider
    }
  }

  return (
    <View style={styles.container}>
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
            autoComplete="password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
      <Pressable onPress={onForgotPassword} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </Pressable>
      {error && (
        <Text style={styles.apiError}>{getAuthErrorMessage(error.code)}</Text>
      )}
      <Button
        title="Login"
        onPress={form.handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
      />
    </View>
  )
}

export { LoginForm }
