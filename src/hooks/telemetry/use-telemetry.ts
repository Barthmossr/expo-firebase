import { useEffect, useState, useCallback } from 'react'
import { logAppOpen, setAnalyticsEnabled } from '../../firebase/analytics'
import { forceCrash, setCrashlyticsEnabled } from '../../firebase/crashlytics'
import { getTelemetryFlags } from '../../firebase/telemetry'
import type { UseTelemetryOutput } from './use-telemetry.types'

const useTelemetry = (): UseTelemetryOutput => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const flags = getTelemetryFlags()
      await setAnalyticsEnabled(flags.analyticsEnabled)
      await setCrashlyticsEnabled(flags.crashlyticsEnabled)
      await logAppOpen()
      setReady(true)
    }

    void initialize()
  }, [])

  const triggerCrash = useCallback((): void => {
    void forceCrash()
  }, [])

  return { ready, triggerCrash }
}

export { useTelemetry }
