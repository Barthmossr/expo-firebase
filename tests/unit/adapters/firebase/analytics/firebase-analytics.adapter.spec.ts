import { getApp } from '@react-native-firebase/app'
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties,
} from '@react-native-firebase/analytics'
import { createFirebaseAnalyticsAdapter } from '@/adapters/firebase/analytics'

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(),
}))

jest.mock('@react-native-firebase/analytics', () => ({
  getAnalytics: jest.fn(),
  logEvent: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn(),
}))

const mockGetApp = getApp as jest.MockedFunction<typeof getApp>
const mockGetAnalytics = getAnalytics as jest.MockedFunction<
  typeof getAnalytics
>
const mockLogEvent = logEvent as jest.MockedFunction<typeof logEvent>
const mockSetEnabled = setAnalyticsCollectionEnabled as jest.MockedFunction<
  typeof setAnalyticsCollectionEnabled
>
const mockSetUserId = setUserId as jest.MockedFunction<typeof setUserId>
const mockSetUserProperties = setUserProperties as jest.MockedFunction<
  typeof setUserProperties
>

describe('createFirebaseAnalyticsAdapter', () => {
  const mockApp = {} as ReturnType<typeof getApp>
  const mockAnalyticsInstance = {} as ReturnType<typeof getAnalytics>

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetApp.mockReturnValue(mockApp)
    mockGetAnalytics.mockReturnValue(mockAnalyticsInstance)
  })

  it('should create adapter with all methods', () => {
    const adapter = createFirebaseAnalyticsAdapter()

    expect(adapter.setEnabled).toBeDefined()
    expect(adapter.logEvent).toBeDefined()
    expect(adapter.setUserId).toBeDefined()
    expect(adapter.setUserProperties).toBeDefined()
  })

  describe('setEnabled', () => {
    it('should call setAnalyticsCollectionEnabled with true', async () => {
      const adapter = createFirebaseAnalyticsAdapter()

      await adapter.setEnabled(true)

      expect(mockSetEnabled).toHaveBeenCalledWith(mockAnalyticsInstance, true)
    })
  })
})
