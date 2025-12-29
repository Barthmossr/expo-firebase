# Firebase and AdMob Credentials Guide

Use this guide to locate each value needed for `.env` and native config files in **your** Firebase project. Keep `.env.example` with placeholders; do not commit real values.

## Firebase Web/JS SDK keys

- Console: Firebase Console → Project settings → General → Your apps → Web app → Config.
- Values: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID` (if web analytics used).

## Android (google-services.json)

- Console: Firebase Console → Project settings → General → Your apps → Android app.
- Values: `FIREBASE_ANDROID_APP_ID`, `FIREBASE_ANDROID_API_KEY`, `FIREBASE_ANDROID_CLIENT_ID`.
- Download `google-services.json` for native build.

## iOS (GoogleService-Info.plist)

- Console: Firebase Console → Project settings → General → Your apps → iOS app.
- Values: `FIREBASE_IOS_APP_ID`, `FIREBASE_IOS_API_KEY`, `FIREBASE_IOS_CLIENT_ID`, reversed client ID (URL scheme).
- Download `GoogleService-Info.plist` for native build.

## SHA fingerprints (Android)

- Location: Firebase Console → Project settings → General → Android app → Add fingerprint.
- Obtain fingerprints:
  - Debug: `keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore -storepass android -keypass android`.
  - Release: from your release keystore (provide store/key passwords as appropriate).

## AdMob

- Console: https://apps.admob.com → Apps → select app (or Add app).
- App ID: shown in App settings (`ADMOB_APP_ID_ANDROID` / `ADMOB_APP_ID_IOS`).
- Banner unit ID: Apps → Ad units → Create ad unit → Banner (`ADMOB_BANNER_UNIT_ANDROID` / `ADMOB_BANNER_UNIT_IOS`).
- For testing: use Google test unit IDs from the AdMob docs until production IDs are ready.

## Analytics and Crashlytics toggles

- Optional flags in `.env`: `ANALYTICS_COLLECTION_ENABLED`, `CRASHLYTICS_COLLECTION_ENABLED`.
- Set to `true` to allow collection; set to `false` if you gate behind user consent.

## Functions health endpoint (public access)

- Make public (after deploy):
  - `gcloud functions add-invoker-policy-binding health --region=southamerica-east1 --project=<your-project-id> --member=allUsers`.
- Endpoint pattern: `https://southamerica-east1-<your-project-id>.cloudfunctions.net/health`.
