const mockAnalyticsInstance = {}

const mockGetAnalytics = jest.fn(() => mockAnalyticsInstance)
const mockSetAnalyticsCollectionEnabled = jest.fn()
const mockLogEvent = jest.fn()
const mockSetUserId = jest.fn()
const mockSetUserProperties = jest.fn()

export {
  mockGetAnalytics as getAnalytics,
  mockSetAnalyticsCollectionEnabled as setAnalyticsCollectionEnabled,
  mockLogEvent as logEvent,
  mockSetUserId as setUserId,
  mockSetUserProperties as setUserProperties,
  mockAnalyticsInstance,
}
