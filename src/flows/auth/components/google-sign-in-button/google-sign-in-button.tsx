import { View, Text, StyleSheet } from 'react-native'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'
import type { GoogleSignInButtonProps } from './google-sign-in-button.types'

const GoogleSignInButton = (
  props: GoogleSignInButtonProps,
): React.ReactElement => {
  const { disabled = false } = props
  const { signInWithGoogle, isLoading } = useAuth()

  const handlePress = async () => {
    try {
      await signInWithGoogle()
    } catch {
      // Error is handled by AuthProvider
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>
      <Button
        title="Continue with Google"
        onPress={handlePress}
        variant="google"
        loading={isLoading}
        disabled={disabled || isLoading}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: SPACING.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border.primary,
  },
  dividerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.tertiary,
    marginHorizontal: SPACING.md,
  },
})

export { GoogleSignInButton }
