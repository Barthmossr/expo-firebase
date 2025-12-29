import { getApp } from '@react-native-firebase/app'
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties,
} from '@react-native-firebase/analytics'
import type { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'
import type { AnalyticsPort, AnalyticsEvent } from '@/core/ports/analytics'

const createFirebaseAnalyticsAdapter = (): AnalyticsPort => {
  const getInstance = (): FirebaseAnalyticsTypes.Module =>
    getAnalytics(getApp())

  return {
    setEnabled: async (enabled: boolean): Promise<void> => {
      await setAnalyticsCollectionEnabled(getInstance(), enabled)
    },

    logEvent: async (event: AnalyticsEvent): Promise<void> => {
      await logEvent(getInstance(), event.name, event.params)
    },

    setUserId: async (userId: string | null): Promise<void> => {
      await setUserId(getInstance(), userId)
    },

    setUserProperties: async (
      properties: Record<string, string>,
    ): Promise<void> => {
      await setUserProperties(getInstance(), properties)
    },
  }
}

export { createFirebaseAnalyticsAdapter }
