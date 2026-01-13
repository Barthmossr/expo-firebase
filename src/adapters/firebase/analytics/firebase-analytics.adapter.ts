import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
  logEvent,
  setUserId,
  setUserProperties,
} from '@react-native-firebase/analytics'
import type { AnalyticsPort, AnalyticsEvent } from '@/core/ports/analytics'

const createFirebaseAnalyticsAdapter = (): AnalyticsPort => {
  const analyticsInstance = getAnalytics()

  return {
    setEnabled: async (enabled: boolean): Promise<void> => {
      await setAnalyticsCollectionEnabled(analyticsInstance, enabled)
    },

    logEvent: async (event: AnalyticsEvent): Promise<void> => {
      await logEvent(analyticsInstance, event.name, event.params)
    },

    setUserId: async (userId: string | null): Promise<void> => {
      await setUserId(analyticsInstance, userId)
    },

    setUserProperties: async (
      properties: Record<string, string>,
    ): Promise<void> => {
      await setUserProperties(analyticsInstance, properties)
    },
  }
}

export { createFirebaseAnalyticsAdapter }
