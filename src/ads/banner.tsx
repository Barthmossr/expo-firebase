import React from 'react'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'
import type { BannerProps } from './banner.types'

const Banner: React.FC<BannerProps> = ({ unitId }) => {
  const adUnitId = unitId || TestIds.BANNER
  return <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />
}

export { Banner }
