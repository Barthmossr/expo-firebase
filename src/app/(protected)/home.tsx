import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { styles } from './home.styles'

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

export default HomeScreen
