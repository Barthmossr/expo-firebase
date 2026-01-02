import { ExpoConfig } from 'expo/config'

const TEST_ADMOB = {
  appIdAndroid: 'ca-app-pub-3940256099942544~3347511713',
  appIdIos: 'ca-app-pub-3940256099942544~1458002511',
  bannerUnitAndroid: 'ca-app-pub-3940256099942544/6300978111',
  bannerUnitIos: 'ca-app-pub-3940256099942544/2934735716',
}

const nodeEnv = (process.env.NODE_ENV ?? '').toLowerCase()
const isDevMode = nodeEnv === 'development' || nodeEnv === 'test'

const hasProdAdMobIds =
  Boolean(process.env.ADMOB_APP_ID_ANDROID) &&
  Boolean(process.env.ADMOB_APP_ID_IOS) &&
  Boolean(process.env.ADMOB_BANNER_UNIT_ANDROID) &&
  Boolean(process.env.ADMOB_BANNER_UNIT_IOS)

if (!isDevMode && !hasProdAdMobIds) {
  throw new Error(
    'AdMob production IDs are required when NODE_ENV is not development or test',
  )
}

const useTestAds = isDevMode || !hasProdAdMobIds

const admob = {
  appIdAndroid: useTestAds
    ? TEST_ADMOB.appIdAndroid
    : (process.env.ADMOB_APP_ID_ANDROID ?? ''),
  appIdIos: useTestAds
    ? TEST_ADMOB.appIdIos
    : (process.env.ADMOB_APP_ID_IOS ?? ''),
  bannerUnitAndroid: useTestAds
    ? TEST_ADMOB.bannerUnitAndroid
    : (process.env.ADMOB_BANNER_UNIT_ANDROID ?? ''),
  bannerUnitIos: useTestAds
    ? TEST_ADMOB.bannerUnitIos
    : (process.env.ADMOB_BANNER_UNIT_IOS ?? ''),
  useTestIds: useTestAds,
}

const telemetry = {
  analyticsEnabled: process.env.ANALYTICS_COLLECTION_ENABLED === 'true',
  crashlyticsEnabled: process.env.CRASHLYTICS_COLLECTION_ENABLED === 'true',
}

const firebase = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

const config: ExpoConfig = {
  name: 'expo-firebase',
  slug: 'expo-firebase',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  scheme: 'expofirebase',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0D0D0D',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.barthmossr.expofirebase',
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    package: 'com.barthmossr.expofirebase',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0D0D0D',
    },
    edgeToEdgeEnabled: true,
    googleServicesFile: './google-services.json',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-router',
      {
        root: './src/app',
      },
    ],
    'expo-secure-store',
    '@react-native-firebase/app',
    '@react-native-firebase/crashlytics',
    '@react-native-google-signin/google-signin',
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: admob.appIdAndroid,
        iosAppId: admob.appIdIos,
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: '555b40d6-c31c-4db7-9ab4-0999cd7ab1d9',
    },
    firebase,
    admob,
    telemetry,
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID ?? '',
  },
}

export default config
