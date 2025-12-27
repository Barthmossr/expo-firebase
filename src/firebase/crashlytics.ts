import crashlytics from '@react-native-firebase/crashlytics'

const setCrashlyticsEnabled = async (enabled: boolean): Promise<void> => {
  await crashlytics().setCrashlyticsCollectionEnabled(enabled)
}

const recordError = async (error: unknown): Promise<void> => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  crashlytics().recordError(new Error(message))
}

export { recordError, setCrashlyticsEnabled }
