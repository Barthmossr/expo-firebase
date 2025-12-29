import type { CrashReportingError } from './crash-reporting.types'

type CrashReportingPort = {
  setEnabled: (enabled: boolean) => Promise<void>
  log: (message: string) => void
  recordError: (error: CrashReportingError) => void
  setUserId: (userId: string | null) => void
  setAttribute: (key: string, value: string) => void
  forceCrash: () => void
}

export type { CrashReportingPort }
