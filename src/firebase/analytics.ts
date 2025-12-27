import analytics from '@react-native-firebase/analytics'

const setAnalyticsEnabled = async (enabled: boolean): Promise<void> => {
  await analytics().setAnalyticsCollectionEnabled(enabled)
}

const logAppOpen = async (): Promise<void> => {
  await analytics().logAppOpen()
}

export { logAppOpen, setAnalyticsEnabled }
