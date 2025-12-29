import {
  crash,
  getCrashlytics,
  log,
  recordError,
  setCrashlyticsCollectionEnabled,
  setUserId,
  setAttribute,
} from '@react-native-firebase/crashlytics'
import type { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics'
import type {
  CrashReportingPort,
  CrashReportingError,
} from '@/core/ports/crash-reporting'

const createFirebaseCrashlyticsAdapter = (): CrashReportingPort => {
  const getInstance = (): FirebaseCrashlyticsTypes.Module => getCrashlytics()

  return {
    setEnabled: async (enabled: boolean): Promise<void> => {
      await setCrashlyticsCollectionEnabled(getInstance(), enabled)
    },

    log: (message: string): void => {
      log(getInstance(), message)
    },

    recordError: (error: CrashReportingError): void => {
      const nativeError = new Error(error.message)
      if (error.stack) {
        nativeError.stack = error.stack
      }
      recordError(getInstance(), nativeError)
    },

    setUserId: (userId: string | null): void => {
      setUserId(getInstance(), userId ?? '')
    },

    setAttribute: (key: string, value: string): void => {
      setAttribute(getInstance(), key, value)
    },

    forceCrash: (): void => {
      log(getInstance(), 'debug_force_crash')
      crash(getInstance())
    },
  }
}

export { createFirebaseCrashlyticsAdapter }
