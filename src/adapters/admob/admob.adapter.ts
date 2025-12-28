import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { TestIds } from 'react-native-google-mobile-ads'
import type { AdsPort } from '@/core/ports/ads'

const createAdmobAdapter = (): AdsPort => {
  const extra = Constants.expoConfig?.extra
  const admob = extra?.['admob'] as
    | {
        bannerUnitAndroid?: string
        bannerUnitIos?: string
      }
    | undefined

  const getBannerUnitId = (): string => {
    const envUnitId =
      Platform.OS === 'ios' ? admob?.bannerUnitIos : admob?.bannerUnitAndroid
    return envUnitId || TestIds.ADAPTIVE_BANNER
  }

  return { getBannerUnitId }
}

export { createAdmobAdapter }
