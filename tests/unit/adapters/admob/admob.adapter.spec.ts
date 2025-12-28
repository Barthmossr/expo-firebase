import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { createAdmobAdapter } from '@/adapters/admob'

jest.mock('expo-constants')
jest.mock('react-native-google-mobile-ads', () => ({
  TestIds: {
    ADAPTIVE_BANNER: 'test-banner-id',
  },
}))

const mockConstants = Constants as jest.Mocked<typeof Constants>

describe('createAdmobAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getBannerUnitId', () => {
    it('should return Android unit id on Android', () => {
      Platform.OS = 'android'
      mockConstants.expoConfig = {
        name: 'test',
        slug: 'test',
        extra: {
          admob: {
            bannerUnitAndroid: 'ca-app-pub-android',
            bannerUnitIos: 'ca-app-pub-ios',
          },
        },
      } as typeof Constants.expoConfig

      const adapter = createAdmobAdapter()
      const unitId = adapter.getBannerUnitId()

      expect(unitId).toBe('ca-app-pub-android')
    })

    it('should return iOS unit id on iOS', () => {
      Platform.OS = 'ios'
      mockConstants.expoConfig = {
        name: 'test',
        slug: 'test',
        extra: {
          admob: {
            bannerUnitAndroid: 'ca-app-pub-android',
            bannerUnitIos: 'ca-app-pub-ios',
          },
        },
      } as typeof Constants.expoConfig

      const adapter = createAdmobAdapter()
      const unitId = adapter.getBannerUnitId()

      expect(unitId).toBe('ca-app-pub-ios')
    })
  })
})
