import {
  getAnalyticsService,
  resetAnalyticsService,
} from '@/services/analytics.service'
import { createFirebaseAnalyticsAdapter } from '@/adapters/firebase/analytics'

jest.mock('@/adapters/firebase/analytics')

const mockCreateAdapter = createFirebaseAnalyticsAdapter as jest.MockedFunction<
  typeof createFirebaseAnalyticsAdapter
>

describe('analytics.service', () => {
  const mockAdapter = {
    setEnabled: jest.fn(),
    logEvent: jest.fn(),
    setUserId: jest.fn(),
    setUserProperties: jest.fn(),
  }

  beforeEach(() => {
    resetAnalyticsService()
    jest.clearAllMocks()
    mockCreateAdapter.mockReturnValue(mockAdapter)
  })

  describe('getAnalyticsService', () => {
    it('should create adapter on first call', () => {
      const service = getAnalyticsService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(service).toBe(mockAdapter)
    })

    it('should return same instance on subsequent calls', () => {
      const first = getAnalyticsService()
      const second = getAnalyticsService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(first).toBe(second)
    })
  })

  describe('resetAnalyticsService', () => {
    it('should create new adapter after reset', () => {
      getAnalyticsService()
      resetAnalyticsService()
      getAnalyticsService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(2)
    })
  })
})
