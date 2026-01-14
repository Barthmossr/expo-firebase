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

  describe('info', () => {
    it('should not call any crashlytics method', () => {
      const adapter = createProductionLoggerAdapter()

      adapter.info('test message')

      expect(mockLog).not.toHaveBeenCalled()
      expect(mockRecordError).not.toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('should call crashlytics log with formatted message', () => {
      const adapter = createProductionLoggerAdapter()

      adapter.warn('test warning')

      expect(mockLog).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        '[WARN] test warning',
      )
    })

    it('should include context in log message', () => {
      const adapter = createProductionLoggerAdapter()

      adapter.warn('slow response', { duration: 5000 })

      expect(mockLog).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        '[WARN] slow response {"duration":5000}',
      )
    })
  })

  describe('error', () => {
    it('should call crashlytics recordError', () => {
      const adapter = createProductionLoggerAdapter()

      adapter.error('test error')

      expect(mockRecordError).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        expect.any(Error),
      )
    })

    it('should create error with formatted message', () => {
      const adapter = createProductionLoggerAdapter()

      adapter.error('fetch failed', { userId: '123' })

      expect(mockRecordError).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        expect.objectContaining({
          message: 'fetch failed {"userId":"123"}',
        }),
      )
    })
  })
})
