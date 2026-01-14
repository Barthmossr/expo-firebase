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
  })
})
