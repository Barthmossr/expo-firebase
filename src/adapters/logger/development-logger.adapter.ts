import type { LoggerPort, LogContext } from '@/core/ports/logger'

const formatMessage = (message: string, context?: LogContext): string => {
  if (!context || Object.keys(context).length === 0) {
    return message
  }
  return `${message} ${JSON.stringify(context)}`
}

const createDevelopmentLoggerAdapter = (): LoggerPort => {
  return {
    debug: (message: string, context?: LogContext): void => {
      console.debug(`[DEBUG] ${formatMessage(message, context)}`)
    },

    info: (message: string, context?: LogContext): void => {
      console.info(`[INFO] ${formatMessage(message, context)}`)
    },

    warn: (message: string, context?: LogContext): void => {
      console.warn(`[WARN] ${formatMessage(message, context)}`)
    },

    error: (message: string, context?: LogContext): void => {
      console.error(`[ERROR] ${formatMessage(message, context)}`)
    },
  }
}

export { createDevelopmentLoggerAdapter }
