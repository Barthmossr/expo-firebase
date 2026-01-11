import type { FirebaseAuthTypes } from '@react-native-firebase/auth'
import Constants from 'expo-constants'

let cachedSettings: FirebaseAuthTypes.ActionCodeSettings | null = null

const resetCache = (): void => {
  cachedSettings = null
}

const getActionCodeSettings = (): FirebaseAuthTypes.ActionCodeSettings => {
  if (cachedSettings) {
    return cachedSettings
  }

  const iosBundleId = Constants.expoConfig?.ios?.bundleIdentifier
  const androidPackage = Constants.expoConfig?.android?.package
  const projectId = Constants.expoConfig?.extra?.['firebase']?.projectId

  if (!iosBundleId) {
    throw new Error('iOS bundleIdentifier is required in app.config.ts')
  }

  if (!androidPackage) {
    throw new Error('Android package is required in app.config.ts')
  }

  if (!projectId) {
    throw new Error(
      'Firebase projectId is required in app.config.ts extra.firebase.projectId',
    )
  }

  cachedSettings = {
    url: `https://${projectId}.firebaseapp.com/reset-password`,
    handleCodeInApp: true,
    iOS: {
      bundleId: iosBundleId,
    },
    android: {
      packageName: androidPackage,
      installApp: true,
      minimumVersion: '1.0.0',
    },
  }

  return cachedSettings
}

export { getActionCodeSettings, resetCache }
