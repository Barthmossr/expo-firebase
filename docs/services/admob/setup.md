# AdMob Setup

## Purpose

- Serve banners via react-native-google-mobile-ads with environment-based test/prod IDs.

## Environment variables

- NODE_ENV
- ADMOB_APP_ID_ANDROID
- ADMOB_APP_ID_IOS
- ADMOB_BANNER_UNIT_ANDROID
- ADMOB_BANNER_UNIT_IOS

## Selection rules

- NODE_ENV in development or test uses official Google test IDs.
- Any other NODE_ENV requires all AdMob env vars; build fails if missing.

## Setup steps

1. Set NODE_ENV=development for local work; omit prod AdMob IDs to stay on test ads.
2. For staging/production, set NODE_ENV accordingly and provide all AdMob env vars.
3. Run `npm run android` or `npm run ios` to build; config injects IDs via the Expo plugin.

## Important: Plugin Parameter Format

The `react-native-google-mobile-ads` Expo config plugin requires **camelCase** parameter names:

```typescript
// Correct (camelCase)
[
  'react-native-google-mobile-ads',
  {
    androidAppId: 'ca-app-pub-xxx',
    iosAppId: 'ca-app-pub-xxx',
  },
]

// Wrong (snake_case) - causes app crash on startup
[
  'react-native-google-mobile-ads',
  {
    android_app_id: 'ca-app-pub-xxx',  // Do NOT use
    ios_app_id: 'ca-app-pub-xxx',      // Do NOT use
  },
]
```

Using snake_case parameters will cause the app to crash immediately on Android with "app keeps stopping" error.

## Verification

- Android: check merged manifest contains the expected `com.google.android.gms.ads.APPLICATION_ID` from the selected env.
- App launch: ensure no AdMob crash; load a banner and confirm test or prod creatives match the env.

## Troubleshooting

- Build fails with missing AdMob IDs: set NODE_ENV to development/test for test IDs or supply all prod env vars.
- Crash at launch: confirm manifest/meta-data matches the intended app ID and that Google Play services are up to date.
