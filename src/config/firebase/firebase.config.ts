import Constants from 'expo-constants'
import type { FirebaseConfig } from './firebase.config.types'

const getFirebaseConfig = (): FirebaseConfig => {
  const extra = Constants.expoConfig?.extra

  if (!extra?.['firebase']) {
    throw new Error('Firebase configuration not found in app.config.ts extra')
  }

  const firebase = extra['firebase'] as Record<string, string | undefined>

  const requiredKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ] as const

  for (const key of requiredKeys) {
    if (!firebase[key]) {
      throw new Error(`Missing required Firebase config: ${key}`)
    }
  }

  return {
    apiKey: firebase['apiKey'] as string,
    authDomain: firebase['authDomain'] as string,
    projectId: firebase['projectId'] as string,
    storageBucket: firebase['storageBucket'] as string,
    messagingSenderId: firebase['messagingSenderId'] as string,
    appId: firebase['appId'] as string,
    measurementId: firebase['measurementId'],
  }
}

export { getFirebaseConfig }
