import { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'
import { useAuth } from '@/hooks/auth'
import {
  AuthTabSelector,
  type AuthTab,
} from '../../components/auth-tab-selector'
import { LoginForm } from '../../components/login-form'
import { RegisterForm } from '../../components/register-form'
import { ForgotPasswordForm } from '../../components/forgot-password-form'
import { GoogleSignInButton } from '../../components/google-sign-in-button'
import type { AuthScreenProps } from './auth-screen.types'

const AuthScreen = (props: AuthScreenProps): React.ReactElement => {
  const { initialTab = 'login' } = props
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab)
  const { clearError } = useAuth()

  const handleTabChange = useCallback(
    (tab: AuthTab) => {
      clearError()
      setActiveTab(tab)
    },
    [clearError],
  )

  const handleForgotPassword = () => {
    handleTabChange('forgot-password')
  }

  const handleBackToLogin = () => {
    handleTabChange('login')
  }

  const renderForm = () => {
    switch (activeTab) {
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

  const showGoogleButton = activeTab !== 'forgot-password'

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
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>
              {activeTab === 'login'
                ? 'Sign in to continue'
                : activeTab === 'register'
                  ? 'Create your account'
                  : 'Reset your password'}
            </Text>
          </View>
          {activeTab !== 'forgot-password' && (
            <AuthTabSelector
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          )}
          {renderForm()}
          {showGoogleButton && <GoogleSignInButton />}
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
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
})

export { AuthScreen }
