import { getAdsService, resetAdsService } from '@/services/ads.service'
import { createAdmobAdapter } from '@/adapters/admob'

jest.mock('@/adapters/admob')

const mockCreateAdapter = createAdmobAdapter as jest.MockedFunction<
  typeof createAdmobAdapter
>

describe('ads.service', () => {
  const mockAdapter = {
    getBannerUnitId: jest.fn(),
  }

  beforeEach(() => {
    resetAdsService()
    jest.clearAllMocks()
    mockCreateAdapter.mockReturnValue(mockAdapter)
  })

  describe('getAdsService', () => {
    it('should create adapter on first call', () => {
      const service = getAdsService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(service).toBe(mockAdapter)
    })
  })
})
