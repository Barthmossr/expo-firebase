import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'

const HomeScreen = (): React.ReactElement => {
  const { user, signOut, isLoading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch {}
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>
            {user?.displayName ?? user?.email ?? 'User'}
          </Text>
          <Text style={styles.description}>
            You are now authenticated. This is a placeholder home screen.
          </Text>
        </View>
        <View style={styles.footer}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="secondary"
            loading={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.accent.primary,
    marginBottom: SPACING.lg,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  footer: {
    marginTop: SPACING.xl,
  },
})

export default HomeScreen
