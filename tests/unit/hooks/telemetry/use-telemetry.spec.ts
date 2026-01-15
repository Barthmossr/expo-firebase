import { renderHook, waitFor } from '@testing-library/react-native'
import { useTelemetry } from '@/hooks/telemetry'
import { getAnalyticsService } from '@/services/analytics'
import { getCrashReportingService } from '@/services/crash-reporting'
import { getTelemetryConfig } from '@/config/telemetry'
import { createMockTelemetryConfig } from './__mocks__/telemetry.mocks'

jest.mock('@/services/analytics')
jest.mock('@/services/crash-reporting')
jest.mock('@/config/telemetry')

const mockGetAnalyticsService = getAnalyticsService as jest.MockedFunction<
  typeof getAnalyticsService
>
const mockGetCrashReportingService =
  getCrashReportingService as jest.MockedFunction<
    typeof getCrashReportingService
  >
const mockGetTelemetryConfig = getTelemetryConfig as jest.MockedFunction<
  typeof getTelemetryConfig
>

describe('useTelemetry', () => {
  const mockAnalytics = {
    setEnabled: jest.fn().mockResolvedValue(undefined),
    logEvent: jest.fn().mockResolvedValue(undefined),
    setUserId: jest.fn().mockResolvedValue(undefined),
    setUserProperties: jest.fn().mockResolvedValue(undefined),
  }

  const mockCrashReporting = {
    setEnabled: jest.fn().mockResolvedValue(undefined),
    log: jest.fn(),
    recordError: jest.fn(),
    setUserId: jest.fn(),
    setAttribute: jest.fn(),
    forceCrash: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAnalyticsService.mockReturnValue(mockAnalytics)
    mockGetCrashReportingService.mockReturnValue(mockCrashReporting)
    mockGetTelemetryConfig.mockReturnValue(createMockTelemetryConfig())
  })

  it('should initialize with ready as false', async () => {
    const { result } = renderHook(() => useTelemetry())
    expect(result.current.ready).toBe(false)
    await waitFor(() => expect(result.current.ready).toBe(true))
  })

  it('should set ready to true after initialization', async () => {
    const { result } = renderHook(() => useTelemetry())

    await waitFor(() => {
      expect(result.current.ready).toBe(true)
    })
  })

  it('should call analytics setEnabled with config value', async () => {
    const { result } = renderHook(() => useTelemetry())

    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(mockAnalytics.setEnabled).toHaveBeenCalledWith(true)
  })

  it('should call crashReporting setEnabled with config value', async () => {
    const { result } = renderHook(() => useTelemetry())

    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(mockCrashReporting.setEnabled).toHaveBeenCalledWith(true)
  })

  it('should log app_open event on initialization', async () => {
    const { result } = renderHook(() => useTelemetry())

    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(mockAnalytics.logEvent).toHaveBeenCalledWith({ name: 'app_open' })
  })

  it('should call forceCrash when triggerCrash is called', async () => {
    const { result } = renderHook(() => useTelemetry())

    await waitFor(() => expect(result.current.ready).toBe(true))
    result.current.triggerCrash()
    expect(mockCrashReporting.forceCrash).toHaveBeenCalled()
  })
})
