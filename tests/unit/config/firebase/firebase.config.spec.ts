import Constants from 'expo-constants'
import { getFirebaseConfig } from '@/config/firebase'
import { createMockFirebaseConfig } from './__mocks__/firebase.mocks'

jest.mock('expo-constants')

const mockConstants = Constants as jest.Mocked<typeof Constants>

describe('getFirebaseConfig', () => {
  const validConfig = createMockFirebaseConfig({
    appId: '1:123:web:abc',
    measurementId: 'G-TEST123',
  })

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

  it('should throw error when apiKey is missing', () => {
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: {
        firebase: { ...validConfig, apiKey: undefined },
      },
    } as typeof Constants.expoConfig

    expect(() => getFirebaseConfig()).toThrow(
      'Missing required Firebase config: apiKey',
    )
  })

  it('should throw error when authDomain is missing', () => {
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: {
        firebase: { ...validConfig, authDomain: undefined },
      },
    } as typeof Constants.expoConfig

    expect(() => getFirebaseConfig()).toThrow(
      'Missing required Firebase config: authDomain',
    )
  })

  it('should throw error when projectId is missing', () => {
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: {
        firebase: { ...validConfig, projectId: undefined },
      },
    } as typeof Constants.expoConfig

    expect(() => getFirebaseConfig()).toThrow(
      'Missing required Firebase config: projectId',
    )
  })

  it('should throw error when storageBucket is missing', () => {
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: {
        firebase: { ...validConfig, storageBucket: undefined },
      },
    } as typeof Constants.expoConfig

    expect(() => getFirebaseConfig()).toThrow(
      'Missing required Firebase config: storageBucket',
    )
  })

  it('should throw error when messagingSenderId is missing', () => {
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: {
        firebase: { ...validConfig, messagingSenderId: undefined },
      },
    } as typeof Constants.expoConfig

    expect(() => getFirebaseConfig()).toThrow(
      'Missing required Firebase config: messagingSenderId',
    )
  })

  it('should throw error when appId is missing', () => {
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: {
        firebase: { ...validConfig, appId: undefined },
      },
    } as typeof Constants.expoConfig

    expect(() => getFirebaseConfig()).toThrow(
      'Missing required Firebase config: appId',
    )
  })

  it('should return valid config when all required fields are present', () => {
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: { firebase: validConfig },
    } as typeof Constants.expoConfig

    const config = getFirebaseConfig()

    expect(config.apiKey).toBe(validConfig.apiKey)
    expect(config.authDomain).toBe(validConfig.authDomain)
    expect(config.projectId).toBe(validConfig.projectId)
    expect(config.storageBucket).toBe(validConfig.storageBucket)
    expect(config.messagingSenderId).toBe(validConfig.messagingSenderId)
    expect(config.appId).toBe(validConfig.appId)
    expect(config.measurementId).toBe(validConfig.measurementId)
  })

  it('should return config without measurementId when not provided', () => {
    const configWithoutMeasurement = {
      ...validConfig,
      measurementId: undefined,
    }
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: { firebase: configWithoutMeasurement },
    } as typeof Constants.expoConfig

    const config = getFirebaseConfig()

    expect(config.measurementId).toBeUndefined()
  })
})
