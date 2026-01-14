import {
  getCrashlytics,
  log,
  recordError,
} from '@react-native-firebase/crashlytics'
import { createProductionLoggerAdapter } from '@/adapters/logger'

jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(),
  log: jest.fn(),
  recordError: jest.fn(),
}))

const mockGetCrashlytics = getCrashlytics as jest.MockedFunction<
  typeof getCrashlytics
>
const mockLog = log as jest.MockedFunction<typeof log>
const mockRecordError = recordError as jest.MockedFunction<typeof recordError>

describe('createProductionLoggerAdapter', () => {
  const mockCrashlyticsInstance = {} as ReturnType<typeof getCrashlytics>

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCrashlytics.mockReturnValue(mockCrashlyticsInstance)
  })

  it('should create adapter with all methods', () => {
    const adapter = createProductionLoggerAdapter()

    expect(adapter.debug).toBeDefined()
    expect(adapter.info).toBeDefined()
    expect(adapter.warn).toBeDefined()
    expect(adapter.error).toBeDefined()
  })

  describe('debug', () => {
    it('should not call any crashlytics method', () => {
      const adapter = createProductionLoggerAdapter()

      adapter.debug('test message')

      expect(mockLog).not.toHaveBeenCalled()
      expect(mockRecordError).not.toHaveBeenCalled()
    })
  })
})
