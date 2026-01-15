jest.mock('@react-native-firebase/app')
jest.mock('@react-native-firebase/analytics')
jest.mock('@react-native-firebase/crashlytics')
jest.mock('expo-constants')
jest.mock('expo-status-bar')

const mockBannerId = 'mock-banner-ad-unit-id'

jest.mock('react-native-google-mobile-ads', () => ({
  TestIds: {
    ADAPTIVE_BANNER: mockBannerId,
  },
  BannerAd: 'BannerAd',
  BannerAdSize: {
    ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  },
}))
