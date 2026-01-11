import type { AdsPort } from '@/core/ports/ads'
import { createAdmobAdapter } from '@/adapters/admob'

let adsService: AdsPort | null = null

const getAdsService = (): AdsPort => {
  if (!adsService) {
    adsService = createAdmobAdapter()
  }
  return adsService
}

const resetAdsService = (): void => {
  adsService = null
}

export { getAdsService, resetAdsService }
