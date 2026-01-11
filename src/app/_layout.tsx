import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as Linking from 'expo-linking'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import { AuthProvider } from '@/providers/auth'

const RootLayout = (): React.ReactElement => {
  const router = useRouter()

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event

      try {
        const parsed = Linking.parse(url)

        if (
          parsed.path === 'reset-password' ||
          parsed.hostname === 'reset-password'
        ) {
          let oobCode = parsed.queryParams?.['oobCode'] as string | undefined

          if (!oobCode) {
            const projectId =
              Constants.expoConfig?.extra?.['firebase']?.projectId

            if (!projectId) {
              throw new Error('Firebase projectId is required in app.config.ts')
            }

            const urlObj = new URL(
              url.replace(
                'expofirebase://',
                `https://${projectId}.firebaseapp.com/`,
              ),
            )
            oobCode = urlObj.searchParams.get('oobCode') || undefined
          }

          if (oobCode) {
            router.push(`/(auth)/reset-password?oobCode=${oobCode}`)
          }
        }
      } catch {
        // Silent fail - invalid deep link format
      }
    }

    const subscription = Linking.addEventListener('url', handleDeepLink)

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url })
      }
    })

    return () => {
      subscription.remove()
    }
  }, [router])

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
