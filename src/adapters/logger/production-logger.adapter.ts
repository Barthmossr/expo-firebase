import {
  getCrashlytics,
  log,
  recordError,
} from '@react-native-firebase/crashlytics'
import type { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics'
import type { LoggerPort, LogContext } from '@/core/ports/logger'

const getInstance = (): FirebaseCrashlyticsTypes.Module => getCrashlytics()

const formatMessage = (message: string, context?: LogContext): string => {
  if (!context || Object.keys(context).length === 0) {
    return message
  }
  return `${message} ${JSON.stringify(context)}`
}

const createProductionLoggerAdapter = (): LoggerPort => {
  return {
    debug: (): void => {
      // No-op in production
    },

    info: (): void => {
      // No-op in production
    },

    warn: (message: string, context?: LogContext): void => {
      log(getInstance(), `[WARN] ${formatMessage(message, context)}`)
    },

    error: (message: string, context?: LogContext): void => {
      const formattedMessage = formatMessage(message, context)
      const error = new Error(formattedMessage)
      recordError(getInstance(), error)
    },
  }
}

export { createProductionLoggerAdapter }
