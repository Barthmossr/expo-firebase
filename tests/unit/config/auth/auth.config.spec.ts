import Constants from 'expo-constants'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { getAuthConfig, initializeGoogleSignIn } from '@/config/auth'

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {},
  },
}))

jest.mock('@react-native-google-signin/google-signin')

const mockGoogleSignin = GoogleSignin as jest.Mocked<typeof GoogleSignin>

type ExpoConfigExtra = {
  extra?: {
    googleWebClientId?: string
  }
}

describe('auth.config', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAuthConfig', () => {
    it('should return empty string when googleWebClientId is missing', () => {
      ;(Constants.expoConfig as ExpoConfigExtra) = {
        extra: {},
      }

      const config = getAuthConfig()

      expect(config.googleWebClientId).toBe('')
    })

    it('should return empty string when extra is undefined', () => {
      ;(Constants.expoConfig as ExpoConfigExtra) = {
        extra: undefined,
      }

      const config = getAuthConfig()

      expect(config.googleWebClientId).toBe('')
    })

    it('should return googleWebClientId when provided', () => {
      const webClientId = 'test-web-client-id.apps.googleusercontent.com'
      ;(Constants.expoConfig as ExpoConfigExtra) = {
        extra: {
          googleWebClientId: webClientId,
        },
      }

      const config = getAuthConfig()

      expect(config.googleWebClientId).toBe(webClientId)
    })
  })
})
