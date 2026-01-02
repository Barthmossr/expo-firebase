import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from '@/providers/auth'

const RootLayout = (): React.ReactElement => {
  useEffect(() => {
    // Hide splash screen after app is ready
  }, [])

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(protected)" />
        </Stack>
        <StatusBar style="light" />
      </AuthProvider>
    </SafeAreaProvider>
  )
}

export default RootLayout
