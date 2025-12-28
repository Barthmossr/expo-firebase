import {
  crash,
  getCrashlytics,
  log,
  recordError as recordCrashlyticsError,
  setCrashlyticsCollectionEnabled,
} from '@react-native-firebase/crashlytics'
import type { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics'

const getCrashlyticsInstance = (): FirebaseCrashlyticsTypes.Module =>
  getCrashlytics()

const setCrashlyticsEnabled = async (enabled: boolean): Promise<void> => {
  await setCrashlyticsCollectionEnabled(getCrashlyticsInstance(), enabled)
}

const recordError = async (error: unknown): Promise<void> => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  recordCrashlyticsError(getCrashlyticsInstance(), new Error(message))
}

const forceCrash = async (): Promise<void> => {
  log(getCrashlyticsInstance(), 'debug_force_crash')
  crash(getCrashlyticsInstance())
}

export { forceCrash, recordError, setCrashlyticsEnabled }
