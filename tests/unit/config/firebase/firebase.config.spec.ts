import Constants from 'expo-constants'
import { getFirebaseConfig } from '@/config/firebase'

jest.mock('expo-constants')

const mockConstants = Constants as jest.Mocked<typeof Constants>

describe('getFirebaseConfig', () => {
  const validConfig = {
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
    projectId: 'test-project',
    storageBucket: 'test.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123:web:abc',
    measurementId: 'G-TEST123',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw error when firebase config is missing', () => {
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: {},
    } as typeof Constants.expoConfig

    expect(() => getFirebaseConfig()).toThrow(
      'Firebase configuration not found in app.config.ts extra',
    )
  })

  it('should throw error when extra is undefined', () => {
    mockConstants.expoConfig = null

    expect(() => getFirebaseConfig()).toThrow(
      'Firebase configuration not found in app.config.ts extra',
    )
  })
})
