import React from 'react'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'
import type { BannerProps } from './banner.types'

const Banner: React.FC<BannerProps> = () => {
  const extra = Constants.expoConfig?.extra
  const admob = extra?.['admob'] as
    | {
        bannerUnitAndroid?: string
        bannerUnitIos?: string
      }
    | undefined

  const envUnitId =
    Platform.OS === 'ios' ? admob?.bannerUnitIos : admob?.bannerUnitAndroid
  const adUnitId = envUnitId || TestIds.ADAPTIVE_BANNER
  return (
    <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  )
}

export { Banner }
