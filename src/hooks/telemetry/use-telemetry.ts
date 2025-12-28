import { useEffect, useState, useCallback } from 'react'
import { getAnalyticsService, getCrashReportingService } from '@/services'
import { getTelemetryConfig } from '@/config/telemetry'
import type { UseTelemetryOutput } from './use-telemetry.types'

const useTelemetry = (): UseTelemetryOutput => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const config = getTelemetryConfig()
      const analytics = getAnalyticsService()
      const crashReporting = getCrashReportingService()

      await analytics.setEnabled(config.analyticsEnabled)
      await crashReporting.setEnabled(config.crashlyticsEnabled)
      await analytics.logEvent({ name: 'app_open' })
      setReady(true)
    }

    void initialize()
  }, [])

  const triggerCrash = useCallback((): void => {
    const crashReporting = getCrashReportingService()
    crashReporting.forceCrash()
  }, [])

  return { ready, triggerCrash }
}

export { useTelemetry }
