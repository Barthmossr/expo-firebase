import Constants from 'expo-constants'
import { randUuid, randProductName } from '@ngneat/falso'
import {
  getActionCodeSettings,
  resetCache,
} from '@/adapters/firebase/auth/firebase-auth.constants'

jest.mock('expo-constants')

const mockConstants = Constants as jest.Mocked<typeof Constants>

describe('getActionCodeSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetCache()
  })

  it('should return action code settings when all config is present', () => {
    const bundleId = `com.${randProductName().toLowerCase()}.app`
    const packageName = `com.${randProductName().toLowerCase()}.app`
    const projectId = randUuid()

    mockConstants.expoConfig = {
      ios: { bundleIdentifier: bundleId },
      android: { package: packageName },
      extra: { firebase: { projectId } },
    } as unknown as typeof mockConstants.expoConfig

    const settings = getActionCodeSettings()

    expect(settings).toEqual({
      url: `https://${projectId}.firebaseapp.com/reset-password`,
      handleCodeInApp: true,
      iOS: {
        bundleId,
      },
      android: {
        packageName,
        installApp: true,
        minimumVersion: '1.0.0',
      },
    })
  })

  it('should throw error when iOS bundleIdentifier is missing', () => {
    const packageName = `com.${randProductName().toLowerCase()}.app`
    const projectId = randUuid()

    mockConstants.expoConfig = {
      ios: {},
      android: { package: packageName },
      extra: { firebase: { projectId } },
    } as unknown as typeof mockConstants.expoConfig

    expect(() => getActionCodeSettings()).toThrow(
      'iOS bundleIdentifier is required in app.config.ts',
    )
  })
})
