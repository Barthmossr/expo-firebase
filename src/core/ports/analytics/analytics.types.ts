type AnalyticsEvent = {
  name: string
  params?: Record<string, unknown>
}

type AnalyticsUserProperties = Record<string, string>

export type { AnalyticsEvent, AnalyticsUserProperties }
