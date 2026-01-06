import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { createAdmobAdapter } from '@/adapters/admob'
import { MOCK_TEST_BANNER_ID } from './__mocks__'

jest.mock('expo-constants')
jest.mock('react-native-google-mobile-ads', () => {
  const { MOCK_TEST_BANNER_ID } = jest.requireActual('./__mocks__/admob.mocks')
  return {
    TestIds: {
      ADAPTIVE_BANNER: MOCK_TEST_BANNER_ID,
    },
  }
})

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

    it('should return test id when admob config is missing', () => {
      Platform.OS = 'android'
      mockConstants.expoConfig = {
        name: 'test',
        slug: 'test',
        extra: {},
      } as typeof Constants.expoConfig

      const adapter = createAdmobAdapter()
      const unitId = adapter.getBannerUnitId()

      expect(unitId).toBe(MOCK_TEST_BANNER_ID)
    })

    it('should return test id when extra is undefined', () => {
      Platform.OS = 'android'
      mockConstants.expoConfig = null

      const adapter = createAdmobAdapter()
      const unitId = adapter.getBannerUnitId()

      expect(unitId).toBe(MOCK_TEST_BANNER_ID)
    })

    it('should return test id when platform unit id is missing', () => {
      Platform.OS = 'android'
      mockConstants.expoConfig = {
        name: 'test',
        slug: 'test',
        extra: {
          admob: {
            bannerUnitIos: 'ca-app-pub-ios',
          },
        },
      } as typeof Constants.expoConfig

      const adapter = createAdmobAdapter()
      const unitId = adapter.getBannerUnitId()

      expect(unitId).toBe(MOCK_TEST_BANNER_ID)
    })
  })
})
