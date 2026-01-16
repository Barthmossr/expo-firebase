import {
  setAnalyticsCollectionEnabled,
  logEvent,
  setUserId,
  setUserProperties,
} from '@react-native-firebase/analytics'
import { mockAnalyticsInstance } from '@mocks/@react-native-firebase/analytics'
import { createFirebaseAnalyticsAdapter } from '@/adapters/firebase/analytics'

const mockSetAnalyticsCollectionEnabled =
  setAnalyticsCollectionEnabled as jest.MockedFunction<
    typeof setAnalyticsCollectionEnabled
  >
const mockLogEvent = logEvent as jest.MockedFunction<typeof logEvent>
const mockSetUserId = setUserId as jest.MockedFunction<typeof setUserId>
const mockSetUserProperties = setUserProperties as jest.MockedFunction<
  typeof setUserProperties
>

describe('createFirebaseAnalyticsAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

      expect(mockSetAnalyticsCollectionEnabled).toHaveBeenCalledWith(
        mockAnalyticsInstance,
        true,
      )
    })

    it('should call setAnalyticsCollectionEnabled with false', async () => {
      const adapter = createFirebaseAnalyticsAdapter()

      await adapter.setEnabled(false)

      expect(mockSetAnalyticsCollectionEnabled).toHaveBeenCalledWith(
        mockAnalyticsInstance,
        false,
      )
    })
  })

  describe('logEvent', () => {
    it('should call logEvent with event name and params', async () => {
      const adapter = createFirebaseAnalyticsAdapter()
      const event = { name: 'test_event', params: { key: 'value' } }

      await adapter.logEvent(event)

      expect(mockLogEvent).toHaveBeenCalledWith(
        mockAnalyticsInstance,
        'test_event',
        {
          key: 'value',
        },
      )
    })
  })

  describe('setUserId', () => {
    it('should call setUserId with user id', async () => {
      const adapter = createFirebaseAnalyticsAdapter()

      await adapter.setUserId('user-123')

      expect(mockSetUserId).toHaveBeenCalledWith(
        mockAnalyticsInstance,
        'user-123',
      )
    })

    it('should call setUserId with null', async () => {
      const adapter = createFirebaseAnalyticsAdapter()

      await adapter.setUserId(null)

      expect(mockSetUserId).toHaveBeenCalledWith(mockAnalyticsInstance, null)
    })
  })

  describe('setUserProperties', () => {
    it('should call setUserProperties with properties', async () => {
      const adapter = createFirebaseAnalyticsAdapter()
      const properties = { plan: 'premium', country: 'US' }

      await adapter.setUserProperties(properties)

      expect(mockSetUserProperties).toHaveBeenCalledWith(
        mockAnalyticsInstance,
        properties,
      )
    })
  })
})
