import { useState, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/hooks/auth'
import { ParticleBackground } from '@/components/ui/particle-background'
import { Logo } from '@/components/ui/logo'
import { LoginForm } from '../../components/login-form'
import { RegisterForm } from '../../components/register-form'
import { ForgotPasswordForm } from '../../components/forgot-password-form'
import { GoogleSignInButton } from '../../components/google-sign-in-button'
import type { AuthScreenProps, AuthView } from './auth-screen.types'
import { styles } from './auth-screen.styles'

const TITLES = {
  login: 'Welcome Back!',
  register: 'Join the Adventure!',
  'forgot-password': 'Reset Password',
} as const

const SUBTITLES = {
  login: 'Ready to continue your journey?',
  register: 'Create your account and start learning',
  'forgot-password': "No worries, we'll help you recover",
} as const

const AuthScreen = (props: AuthScreenProps): React.ReactElement => {
  const { initialView = 'login' } = props
  const [activeView, setActiveView] = useState<AuthView>(initialView)
  const { clearError } = useAuth()

  const handleViewChange = useCallback(
    (view: AuthView) => {
      clearError()
      setActiveView(view)
    },
    [clearError],
  )

  const handleForgotPassword = () => {
    handleViewChange('forgot-password')
  }

  const handleBackToLogin = () => {
    handleViewChange('login')
  }

  const renderForm = () => {
    switch (activeView) {
      case 'login':
        return <LoginForm onForgotPassword={handleForgotPassword} />
      case 'register':
        return <RegisterForm />
      case 'forgot-password':
        return <ForgotPasswordForm onBack={handleBackToLogin} />
      default:
        return null
    }
  }

  const renderSwitchText = () => {
    if (activeView === 'forgot-password') {
      return null
    }

    const isLogin = activeView === 'login'
    const questionText = isLogin
      ? "Don't have an account? "
      : 'Already have an account? '
    const actionText = isLogin ? 'Join Now' : 'Login'
    const targetView = isLogin ? 'register' : 'login'

    return (
      <View style={styles.switchContainer} accessibilityRole="text">
        <Text style={styles.switchText}>{questionText}</Text>
        <Pressable
          onPress={() => handleViewChange(targetView)}
          accessibilityRole="link"
          accessibilityLabel={actionText}
          accessibilityHint={
            isLogin
              ? 'Navigate to registration screen'
              : 'Navigate to login screen'
          }
        >
          <Text style={styles.switchAction}>{actionText}</Text>
        </Pressable>
      </View>
    )
  }

  const showGoogleButton = activeView !== 'forgot-password'

  return (
    <SafeAreaView style={styles.safeArea}>
      <ParticleBackground particleCount={15} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Logo size="large" />
            </View>
            <Text style={styles.title}>{TITLES[activeView]}</Text>
            <Text style={styles.subtitle}>{SUBTITLES[activeView]}</Text>
          </View>
          <View style={styles.formCard}>
            {renderForm()}
            {showGoogleButton && <GoogleSignInButton />}
          </View>
          {renderSwitchText()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export { AuthScreen }
