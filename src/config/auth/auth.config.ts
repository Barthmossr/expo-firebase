import Constants from 'expo-constants'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import type { AuthConfig } from './auth.config.types'

const getAuthConfig = (): AuthConfig => {
  const extra = Constants.expoConfig?.extra as
    | { googleWebClientId?: string }
    | undefined

  return {
    googleWebClientId: extra?.googleWebClientId ?? '',
  }
}

const initializeGoogleSignIn = (): void => {
  const config = getAuthConfig()
  GoogleSignin.configure({
    webClientId: config.googleWebClientId,
    offlineAccess: true,
  })
}

export { getAuthConfig, initializeGoogleSignIn }
