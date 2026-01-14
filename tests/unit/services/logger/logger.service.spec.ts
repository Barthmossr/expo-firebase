import { getLoggerService, resetLoggerService } from '@/services/logger'
import {
  createDevelopmentLoggerAdapter,
  createProductionLoggerAdapter,
} from '@/adapters/logger'
import { getLoggerConfig } from '@/config/logger'

jest.mock('@/adapters/logger')
jest.mock('@/config/logger')

const mockCreateDevAdapter =
  createDevelopmentLoggerAdapter as jest.MockedFunction<
    typeof createDevelopmentLoggerAdapter
  >
const mockCreateProdAdapter =
  createProductionLoggerAdapter as jest.MockedFunction<
    typeof createProductionLoggerAdapter
  >
const mockGetLoggerConfig = getLoggerConfig as jest.MockedFunction<
  typeof getLoggerConfig
>

describe('logger.service', () => {
  const mockDevAdapter = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  const mockProdAdapter = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  beforeEach(() => {
    resetLoggerService()
    jest.clearAllMocks()
    mockCreateDevAdapter.mockReturnValue(mockDevAdapter)
    mockCreateProdAdapter.mockReturnValue(mockProdAdapter)
  })

  describe('getLoggerService', () => {
    it('should create development adapter when isDevelopment is true', () => {
      mockGetLoggerConfig.mockReturnValue({ isDevelopment: true })

      const service = getLoggerService()

      expect(mockCreateDevAdapter).toHaveBeenCalledTimes(1)
      expect(mockCreateProdAdapter).not.toHaveBeenCalled()
      expect(service).toBe(mockDevAdapter)
    })

    it('should create production adapter when isDevelopment is false', () => {
      mockGetLoggerConfig.mockReturnValue({ isDevelopment: false })

      const service = getLoggerService()

      expect(mockCreateProdAdapter).toHaveBeenCalledTimes(1)
      expect(mockCreateDevAdapter).not.toHaveBeenCalled()
      expect(service).toBe(mockProdAdapter)
    })

    it('should return same instance on subsequent calls', () => {
      mockGetLoggerConfig.mockReturnValue({ isDevelopment: true })

      const first = getLoggerService()
      const second = getLoggerService()

      expect(mockCreateDevAdapter).toHaveBeenCalledTimes(1)
      expect(first).toBe(second)
    })
  })

  describe('resetLoggerService', () => {
    it('should create new adapter after reset', () => {
      mockGetLoggerConfig.mockReturnValue({ isDevelopment: true })

      getLoggerService()
      resetLoggerService()
      getLoggerService()

      expect(mockCreateDevAdapter).toHaveBeenCalledTimes(2)
    })
  })
})
