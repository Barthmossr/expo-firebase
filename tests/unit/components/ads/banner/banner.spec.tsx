import React from 'react'
import { randUuid } from '@ngneat/falso'
import { render } from '@testing-library/react-native'
import { Banner } from '@/components/ads/banner'
import { getAdsService } from '@/services/ads'

const testBannerId = randUuid()

jest.mock('@/services/ads')
jest.mock('react-native-google-mobile-ads', () => ({
  BannerAd: 'BannerAd',
  BannerAdSize: {
    ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  },
}))

const mockGetAdsService = getAdsService as jest.MockedFunction<
  typeof getAdsService
>

describe('Banner', () => {
  const mockAdsService = {
    getBannerUnitId: jest.fn().mockReturnValue(testBannerId),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAdsService.mockReturnValue(mockAdsService)
  })

  it('should render BannerAd component', () => {
    const { UNSAFE_root } = render(<Banner />)

    expect(UNSAFE_root).toBeTruthy()
  })

  it('should call getAdsService', () => {
    render(<Banner />)

    expect(mockGetAdsService).toHaveBeenCalled()
  })

  it('should call getBannerUnitId', () => {
    render(<Banner />)

    expect(mockAdsService.getBannerUnitId).toHaveBeenCalled()
  })
})
