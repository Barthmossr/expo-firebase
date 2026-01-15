# AdMob Setup

## Purpose

- Serve banners via react-native-google-mobile-ads with environment-based test/prod IDs.

## Environment variables

| Variable                    | Required       | Description                   |
| --------------------------- | -------------- | ----------------------------- |
| `ADMOB_APP_ID_ANDROID`      | For production | AdMob App ID for Android      |
| `ADMOB_APP_ID_IOS`          | For production | AdMob App ID for iOS          |
| `ADMOB_BANNER_UNIT_ANDROID` | For production | Banner Ad Unit ID for Android |
| `ADMOB_BANNER_UNIT_IOS`     | For production | Banner Ad Unit ID for iOS     |

## Selection Rules

The app automatically selects test or production AdMob IDs based on the following logic:

```
Has production AdMob IDs configured?
├── YES → Use production IDs
└── NO  → Use Google's official test IDs
```

**Test IDs (automatically used when no production IDs are set):**

- Android App ID: `ca-app-pub-3940256099942544~3347511713`
- iOS App ID: `ca-app-pub-3940256099942544~1458002511`
- Android Banner: `ca-app-pub-3940256099942544/6300978111`
- iOS Banner: `ca-app-pub-3940256099942544/2934735716`

## Setup Steps

### For Development (Test Ads)

No configuration needed. Test ads are used automatically when production IDs are not set.

```bash
# Just run the app - test ads will be shown
npm run android
npm run ios
```

### For Production (Real Ads)

1. Create an AdMob account at [admob.google.com](https://admob.google.com)
2. Create an app and ad units
3. Configure environment variables in EAS:

```bash
eas env:create --name ADMOB_APP_ID_ANDROID --value "ca-app-pub-xxx" --environment production
eas env:create --name ADMOB_APP_ID_IOS --value "ca-app-pub-xxx" --environment production
eas env:create --name ADMOB_BANNER_UNIT_ANDROID --value "ca-app-pub-xxx/xxx" --environment production
eas env:create --name ADMOB_BANNER_UNIT_IOS --value "ca-app-pub-xxx/xxx" --environment production
```

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

| Issue                          | Solution                                               |
| ------------------------------ | ------------------------------------------------------ |
| Test ads showing in production | Verify all 4 AdMob env vars are set in EAS             |
| Crash at launch                | Confirm manifest/meta-data matches the intended app ID |
| Ads not loading                | Check Google Play services are up to date              |
