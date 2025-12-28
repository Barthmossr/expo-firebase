jest.mock('@react-native-firebase/app')
jest.mock('@react-native-firebase/analytics')
jest.mock('@react-native-firebase/crashlytics')
jest.mock('expo-constants')
jest.mock('expo-status-bar')

jest.mock('@/hooks/telemetry', () => ({
  useTelemetry: jest.fn(() => ({
    ready: true,
    triggerCrash: jest.fn(),
  })),
}))
