const mockGetAnalytics = jest.fn(() => ({}))
const mockLogEvent = jest.fn()
const mockSetAnalyticsCollectionEnabled = jest.fn()

export {
  mockGetAnalytics as getAnalytics,
  mockLogEvent as logEvent,
  mockSetAnalyticsCollectionEnabled as setAnalyticsCollectionEnabled,
}
