import Constants from 'expo-constants'
import type { TelemetryFlags } from './telemetry.types'

const getTelemetryFlags = (): TelemetryFlags => {
  const extra = Constants.expoConfig?.extra
  const telemetry = extra?.['telemetry'] as Partial<TelemetryFlags> | undefined

  return {
    analyticsEnabled: telemetry?.analyticsEnabled ?? false,
    crashlyticsEnabled: telemetry?.crashlyticsEnabled ?? false,
  }
}

export { getTelemetryFlags }
