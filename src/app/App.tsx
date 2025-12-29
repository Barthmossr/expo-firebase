import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useTelemetry } from '../hooks/telemetry'

const App = (): React.ReactElement => {
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
