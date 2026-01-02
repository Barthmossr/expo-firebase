import React from 'react'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads'
import { getAdsService } from '@/services/ads'
import type { BannerProps } from './banner.types'

const Banner: React.FC<BannerProps> = () => {
  const adsService = getAdsService()
  const adUnitId = adsService.getBannerUnitId()

  return (
    <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  )
}

export { Banner }
