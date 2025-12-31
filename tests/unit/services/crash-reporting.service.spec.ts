import {
  getCrashReportingService,
  resetCrashReportingService,
} from '@/services/crash-reporting'
import { createFirebaseCrashlyticsAdapter } from '@/adapters/firebase/crash-reporting'

jest.mock('@/adapters/firebase/crash-reporting')

const mockCreateAdapter =
  createFirebaseCrashlyticsAdapter as jest.MockedFunction<
    typeof createFirebaseCrashlyticsAdapter
  >

describe('crash-reporting.service', () => {
  const mockAdapter = {
    setEnabled: jest.fn(),
    log: jest.fn(),
    recordError: jest.fn(),
    setUserId: jest.fn(),
    setAttribute: jest.fn(),
    forceCrash: jest.fn(),
  }

  beforeEach(() => {
    resetCrashReportingService()
    jest.clearAllMocks()
    mockCreateAdapter.mockReturnValue(mockAdapter)
  })

  describe('getCrashReportingService', () => {
    it('should create adapter on first call', () => {
      const service = getCrashReportingService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(service).toBe(mockAdapter)
    })

    it('should return same instance on subsequent calls', () => {
      const first = getCrashReportingService()
      const second = getCrashReportingService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(first).toBe(second)
    })
  })

  describe('resetCrashReportingService', () => {
    it('should create new adapter after reset', () => {
      getCrashReportingService()
      resetCrashReportingService()
      getCrashReportingService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(2)
    })
  })
})
