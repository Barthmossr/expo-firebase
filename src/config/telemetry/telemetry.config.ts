import Constants from 'expo-constants'
import type { TelemetryConfig } from './telemetry.config.types'

const getTelemetryConfig = (): TelemetryConfig => {
  const extra = Constants.expoConfig?.extra
  const telemetry = extra?.['telemetry'] as Partial<TelemetryConfig> | undefined

  return {
    analyticsEnabled: telemetry?.analyticsEnabled ?? false,
    crashlyticsEnabled: telemetry?.crashlyticsEnabled ?? false,
  }
}

export { getTelemetryConfig }
