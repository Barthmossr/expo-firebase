import Constants from 'expo-constants'
import type { LoggerConfig } from './logger.config.types'

const getLoggerConfig = (): LoggerConfig => {
  const isDevelopment =
    Constants.executionEnvironment === 'storeClient' ? false : __DEV__

  return {
    isDevelopment,
  }
}

export { getLoggerConfig }
