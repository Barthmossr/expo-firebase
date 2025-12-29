import type { CrashReportingPort } from '@/core/ports/crash-reporting'
import { createFirebaseCrashlyticsAdapter } from '@/adapters/firebase/crash-reporting'

let crashReportingInstance: CrashReportingPort | null = null

const getCrashReportingService = (): CrashReportingPort => {
  if (!crashReportingInstance) {
    crashReportingInstance = createFirebaseCrashlyticsAdapter()
  }
  return crashReportingInstance
}

const resetCrashReportingService = (): void => {
  crashReportingInstance = null
}

export { getCrashReportingService, resetCrashReportingService }
