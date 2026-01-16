import type { AnalyticsEvent, AnalyticsUserProperties } from './analytics.types'

type AnalyticsPort = {
  setEnabled: (enabled: boolean) => Promise<void>
  logEvent: (event: AnalyticsEvent) => Promise<void>
  setUserId: (userId: string | null) => Promise<void>
  setUserProperties: (properties: AnalyticsUserProperties) => Promise<void>
}

export type { AnalyticsPort }
