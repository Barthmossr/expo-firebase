const mockGetCrashlytics = jest.fn(() => ({}))
const mockCrash = jest.fn()
const mockLog = jest.fn()
const mockRecordError = jest.fn()
const mockSetCrashlyticsCollectionEnabled = jest.fn()

export {
  mockGetCrashlytics as getCrashlytics,
  mockCrash as crash,
  mockLog as log,
  mockRecordError as recordError,
  mockSetCrashlyticsCollectionEnabled as setCrashlyticsCollectionEnabled,
}
