// Mock Expo modules that cause issues in test environment
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}))

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
}

beforeAll(() => {
  // Global setup before all tests
})

afterAll(() => {
  // Global cleanup after all tests
})
