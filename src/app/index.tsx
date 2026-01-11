import { Redirect } from 'expo-router'
import { useAuth } from '@/hooks/auth'
import { LoadingIndicator } from '@/components/ui/loading-indicator'

const Index = (): React.ReactElement => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingIndicator text="Loading..." />
  }

  if (isAuthenticated) {
    return <Redirect href="/(protected)/home" />
  }

  return <Redirect href="/(auth)" />
}

export default Index
