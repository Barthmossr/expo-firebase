import Constants from 'expo-constants'
import { getTelemetryConfig } from '@/config/telemetry'

jest.mock('expo-constants')

const mockConstants = Constants as jest.Mocked<typeof Constants>

describe('getTelemetryConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return default values when telemetry config is missing', () => {
    mockConstants.expoConfig = {
      name: 'test',
      slug: 'test',
      extra: {},
    } as typeof Constants.expoConfig

    const config = getTelemetryConfig()

    expect(config.analyticsEnabled).toBe(false)
    expect(config.crashlyticsEnabled).toBe(false)
  })

  it('should return default values when extra is undefined', () => {
    mockConstants.expoConfig = null

    const config = getTelemetryConfig()

    expect(config.analyticsEnabled).toBe(false)
    expect(config.crashlyticsEnabled).toBe(false)
  })
})
