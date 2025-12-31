import { useState, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'
import { useAuth } from '@/hooks/auth'
import { LoginForm } from '../../components/login-form'
import { RegisterForm } from '../../components/register-form'
import { ForgotPasswordForm } from '../../components/forgot-password-form'
import { GoogleSignInButton } from '../../components/google-sign-in-button'
import type { AuthScreenProps, AuthView } from './auth-screen.types'

const EMOJIS = {
  login: '🎮',
  register: '🚀',
  'forgot-password': '🔑',
} as const

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
            <Text style={styles.emoji}>{EMOJIS[activeView]}</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  switchText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  switchAction: {
    ...TYPOGRAPHY.body,
    color: COLORS.accent.secondary,
    fontWeight: '600',
    marginBottom: 1,
  },
})

export { AuthScreen }
