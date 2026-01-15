import type { LoggerPort } from '@/core/ports/logger'
import {
  createDevelopmentLoggerAdapter,
  createProductionLoggerAdapter,
} from '@/adapters/logger'
import { getLoggerConfig } from '@/config/logger'

let loggerInstance: LoggerPort | null = null

const getLoggerService = (): LoggerPort => {
  if (!loggerInstance) {
    const config = getLoggerConfig()
    loggerInstance = config.isDevelopment
      ? createDevelopmentLoggerAdapter()
      : createProductionLoggerAdapter()
  }
  return loggerInstance
}

const resetLoggerService = (): void => {
  loggerInstance = null
}

export { getLoggerService, resetLoggerService }
