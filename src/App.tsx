import { useEffect, useState, useCallback } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import { logAppOpen, setAnalyticsEnabled } from './firebase/analytics'
import { forceCrash, setCrashlyticsEnabled } from './firebase/crashlytics'
import { getTelemetryFlags } from './firebase/telemetry'

const useTelemetry = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      const flags = getTelemetryFlags()
      await setAnalyticsEnabled(flags.analyticsEnabled)
      await setCrashlyticsEnabled(flags.crashlyticsEnabled)
      await logAppOpen()
      setReady(true)
    }

    void initialize()
  }, [])

  const triggerCrash = useCallback(() => {
    void forceCrash()
  }, [])

  return { ready, triggerCrash }
}

const App = () => {
  const { ready, triggerCrash } = useTelemetry()

  return (
    <View style={styles.container}>
      <Text testID="welcome-message">Welcome to Expo Firebase</Text>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>Telemetry ready: {ready ? 'yes' : 'no'}</Text>
      <Button title="Trigger test crash" onPress={triggerCrash} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export { App }
