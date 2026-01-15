import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { useAuth } from '@/hooks/auth'
import { COLORS } from '@/theme'

const AuthLayout = (): React.ReactElement => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (isAuthenticated) {
      router.replace('/(protected)/home')
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background.primary },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  )
}

export default AuthLayout
