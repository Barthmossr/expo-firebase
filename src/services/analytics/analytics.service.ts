import type { AnalyticsPort } from '@/core/ports/analytics'
import { createFirebaseAnalyticsAdapter } from '@/adapters/firebase/analytics'

let analyticsInstance: AnalyticsPort | null = null

const getAnalyticsService = (): AnalyticsPort => {
  if (!analyticsInstance) {
    analyticsInstance = createFirebaseAnalyticsAdapter()
  }
  return analyticsInstance
}

const resetAnalyticsService = (): void => {
  analyticsInstance = null
}

export { getAnalyticsService, resetAnalyticsService }
