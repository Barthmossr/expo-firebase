import { getApp } from '@react-native-firebase/app'
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
} from '@react-native-firebase/analytics'
import type { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'

const getAnalyticsInstance = (): FirebaseAnalyticsTypes.Module =>
  getAnalytics(getApp())

const setAnalyticsEnabled = async (enabled: boolean): Promise<void> => {
  await setAnalyticsCollectionEnabled(getAnalyticsInstance(), enabled)
}

const logAppOpen = async (): Promise<void> => {
  await logEvent(getAnalyticsInstance(), 'app_open')
}

export { logAppOpen, setAnalyticsEnabled }
