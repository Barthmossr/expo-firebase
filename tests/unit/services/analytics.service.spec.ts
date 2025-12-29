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
  })
})
