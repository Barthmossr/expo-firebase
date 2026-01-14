import { getLoggerConfig } from '@/config/logger'
import Constants from 'expo-constants'

jest.mock('expo-constants', () => ({
  executionEnvironment: 'standalone',
}))

describe('logger.config', () => {
  const originalDev = (global as Record<string, unknown>)['__DEV__']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    ;(global as Record<string, unknown>)['__DEV__'] = originalDev
  })

  describe('getLoggerConfig', () => {
    it('should return isDevelopment true when __DEV__ is true', () => {
      ;(global as Record<string, unknown>)['__DEV__'] = true
      ;(Constants as { executionEnvironment: string }).executionEnvironment =
        'standalone'

      const config = getLoggerConfig()

      expect(config.isDevelopment).toBe(true)
    })

    it('should return isDevelopment false when __DEV__ is false', () => {
      ;(global as Record<string, unknown>)['__DEV__'] = false
      ;(Constants as { executionEnvironment: string }).executionEnvironment =
        'standalone'

      const config = getLoggerConfig()

      expect(config.isDevelopment).toBe(false)
    })

    it('should return isDevelopment false when storeClient', () => {
      ;(global as Record<string, unknown>)['__DEV__'] = true
      ;(Constants as { executionEnvironment: string }).executionEnvironment =
        'storeClient'

      const config = getLoggerConfig()

      expect(config.isDevelopment).toBe(false)
    })
  })
})
