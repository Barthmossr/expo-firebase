import { View, Text } from 'react-native'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import type { GoogleSignInButtonProps } from './google-sign-in-button.types'
import { styles } from './google-sign-in-button.styles'

const GoogleSignInButton = (
  props: GoogleSignInButtonProps,
): React.ReactElement => {
  const { disabled = false } = props
  const { signInWithGoogle, isLoading } = useAuth()

  const handlePress = async () => {
    try {
      await signInWithGoogle()
    } catch {}
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

export { GoogleSignInButton }
