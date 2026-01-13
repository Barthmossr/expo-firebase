import type { TelemetryConfig } from '@/config/telemetry'

const createMockTelemetryConfig = (): TelemetryConfig => ({
  analyticsEnabled: true,
  crashlyticsEnabled: true,
})

export { createMockTelemetryConfig }
