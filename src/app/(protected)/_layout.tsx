import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useAuth } from '@/hooks/auth'
import { LoadingIndicator } from '@/components/ui/loading-indicator'
import { COLORS } from '@/theme'

const ProtectedLayout = (): React.ReactElement => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (isLoading) {
      return
    }

    const inProtectedGroup = segments[0] === '(protected)'

    if (!isAuthenticated && inProtectedGroup) {
      router.replace('/(auth)')
    }
  }, [isAuthenticated, isLoading, segments, router])

  if (isLoading) {
    return <LoadingIndicator text="Loading..." />
  }

  if (!isAuthenticated) {
    return <LoadingIndicator text="Redirecting..." />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background.primary },
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  )
}

export default ProtectedLayout
