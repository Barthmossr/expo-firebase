import {
  crash,
  getCrashlytics,
  log,
  recordError,
  setCrashlyticsCollectionEnabled,
  setUserId,
  setAttribute,
} from '@react-native-firebase/crashlytics'
import { createFirebaseCrashlyticsAdapter } from '@/adapters/firebase/crash-reporting'

jest.mock('@react-native-firebase/crashlytics', () => ({
  crash: jest.fn(),
  getCrashlytics: jest.fn(),
  log: jest.fn(),
  recordError: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(),
  setUserId: jest.fn(),
  setAttribute: jest.fn(),
}))

const mockGetCrashlytics = getCrashlytics as jest.MockedFunction<
  typeof getCrashlytics
>
const mockSetEnabled = setCrashlyticsCollectionEnabled as jest.MockedFunction<
  typeof setCrashlyticsCollectionEnabled
>
const mockLog = log as jest.MockedFunction<typeof log>
const mockRecordError = recordError as jest.MockedFunction<typeof recordError>
const mockSetUserId = setUserId as jest.MockedFunction<typeof setUserId>
const mockSetAttribute = setAttribute as jest.MockedFunction<
  typeof setAttribute
>
const mockCrash = crash as jest.MockedFunction<typeof crash>

describe('createFirebaseCrashlyticsAdapter', () => {
  const mockCrashlyticsInstance = {} as ReturnType<typeof getCrashlytics>

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCrashlytics.mockReturnValue(mockCrashlyticsInstance)
  })

  it('should create adapter with all methods', () => {
    const adapter = createFirebaseCrashlyticsAdapter()

    expect(adapter.setEnabled).toBeDefined()
    expect(adapter.log).toBeDefined()
    expect(adapter.recordError).toBeDefined()
    expect(adapter.setUserId).toBeDefined()
    expect(adapter.setAttribute).toBeDefined()
    expect(adapter.forceCrash).toBeDefined()
  })

  describe('setEnabled', () => {
    it('should call setCrashlyticsCollectionEnabled with true', async () => {
      const adapter = createFirebaseCrashlyticsAdapter()

      await adapter.setEnabled(true)

      expect(mockSetEnabled).toHaveBeenCalledWith(mockCrashlyticsInstance, true)
    })

    it('should call setCrashlyticsCollectionEnabled with false', async () => {
      const adapter = createFirebaseCrashlyticsAdapter()

      await adapter.setEnabled(false)

      expect(mockSetEnabled).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        false,
      )
    })
  })

  describe('log', () => {
    it('should call log with message', () => {
      const adapter = createFirebaseCrashlyticsAdapter()

      adapter.log('test message')

      expect(mockLog).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        'test message',
      )
    })
  })

  describe('recordError', () => {
    it('should call recordError with error message', () => {
      const adapter = createFirebaseCrashlyticsAdapter()

      adapter.recordError({ message: 'Test error' })

      expect(mockRecordError).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        expect.objectContaining({ message: 'Test error' }),
      )
    })

    it('should call recordError with error message and stack', () => {
      const adapter = createFirebaseCrashlyticsAdapter()
      const stack = 'Error: Test\n    at test.js:1:1'

      adapter.recordError({ message: 'Test error', stack })

      expect(mockRecordError).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        expect.objectContaining({ message: 'Test error', stack }),
      )
    })
  })

  describe('setUserId', () => {
    it('should call setUserId with user id', () => {
      const adapter = createFirebaseCrashlyticsAdapter()

      adapter.setUserId('user123')

      expect(mockSetUserId).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        'user123',
      )
    })

    it('should call setUserId with empty string when null', () => {
      const adapter = createFirebaseCrashlyticsAdapter()

      adapter.setUserId(null)

      expect(mockSetUserId).toHaveBeenCalledWith(mockCrashlyticsInstance, '')
    })
  })

  describe('setAttribute', () => {
    it('should call setAttribute with key and value', () => {
      const adapter = createFirebaseCrashlyticsAdapter()

      adapter.setAttribute('key', 'value')

      expect(mockSetAttribute).toHaveBeenCalledWith(
        mockCrashlyticsInstance,
        'key',
        'value',
      )
    })
  })
})
