import { renderHook, waitFor } from '@testing-library/react-native'
import { useTelemetry } from '@/hooks/telemetry'
import { getAnalyticsService, getCrashReportingService } from '@/services'
import { getTelemetryConfig } from '@/config/telemetry'

jest.mock('@/services')
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
    mockGetTelemetryConfig.mockReturnValue({
      analyticsEnabled: true,
      crashlyticsEnabled: true,
    })
  })

  it('should initialize with ready as false', async () => {
    const { result } = renderHook(() => useTelemetry())
    expect(result.current.ready).toBe(false)
    await waitFor(() => expect(result.current.ready).toBe(true))
  })
})
