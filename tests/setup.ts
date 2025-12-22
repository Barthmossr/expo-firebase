jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn(() => null),
}))
