# Firebase Setup

This document describes the Firebase project configuration for expo-firebase.

## Project Information

| Property           | Value                                     |
| ------------------ | ----------------------------------------- |
| **Project ID**     | `expo-firebase-46af7`                     |
| **Project Name**   | expo-firebase                             |
| **Region**         | `southamerica-east1` (São Paulo)          |
| **Bundle ID**      | `com.barthmossr.expofirebase`             |
| **Storage Bucket** | `expo-firebase-46af7.firebasestorage.app` |

## Enabled Services

| Service           | Status     | Description                           |
| ----------------- | ---------- | ------------------------------------- |
| Authentication    | ✅ Enabled | Email/Password, Google Provider       |
| Firestore         | ✅ Enabled | Primary database (southamerica-east1) |
| Realtime Database | ✅ Enabled | Real-time sync (us-central1)          |
| Cloud Storage     | ✅ Enabled | File storage                          |
| Cloud Functions   | ✅ Enabled | Server-side logic                     |
| Analytics         | ✅ Enabled | User analytics                        |
| Crashlytics       | ✅ Enabled | Crash reporting                       |
| AdMob             | ✅ Enabled | Monetization                          |

## Project Structure

```
├── firebase.json           # Firebase CLI configuration
├── .firebaserc             # Project aliases
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── database.rules.json     # Realtime Database rules
├── storage.rules           # Cloud Storage rules
└── functions/              # Cloud Functions source
    ├── src/
    │   └── index.ts        # Functions entry point
    ├── package.json
    └── tsconfig.json
```

## Prerequisites

1. **Firebase CLI** installed globally:

```bash
npm install -g firebase-tools
```

2. **Login** to Firebase:

```bash
firebase login
```

## Configuration Files

### Environment Variables

Copy `.env.example` to `.env` and fill in the Firebase credentials:

```bash
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=expo-firebase-46af7.firebaseapp.com
FIREBASE_PROJECT_ID=expo-firebase-46af7
FIREBASE_STORAGE_BUCKET=expo-firebase-46af7.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=382102907936
FIREBASE_APP_ID=your-app-id
FIREBASE_DATABASE_URL=https://expo-firebase-46af7-default-rtdb.firebaseio.com
```

### Native Config Files

- **Android**: `google-services.json` (gitignored)
- **iOS**: `GoogleService-Info.plist` (gitignored)

Download these from Firebase Console > Project Settings > Your Apps.

## Deployment

### Deploy All Services

```bash
firebase deploy
```

### Deploy Specific Services

```bash
# Firestore rules and indexes
firebase deploy --only firestore

# Realtime Database rules
firebase deploy --only database

# Storage rules
firebase deploy --only storage

# Cloud Functions
firebase deploy --only functions
```

## Cloud Functions

### Development

```bash
cd functions
npm install
npm run build
```

### Local Testing

```bash
npm run serve
```

### Deployment

```bash
npm run deploy
```

Functions configuration:

- Global options: region `southamerica-east1`, maxInstances `10`
- HTTP endpoint: `health` (returns status ok; CORS enabled)

## Security Rules

### Authentication Providers

- Email/Password: enabled
- Google: enabled
  - Android OAuth client ID: 382102907936-uv03kgvjha72o1t660gm5tf3rjpkr2le.apps.googleusercontent.com
  - iOS OAuth client ID: 382102907936-4c72n0fr2uuoltacfqr2c23jrs5fp7fj.apps.googleusercontent.com
  - iOS reversed client ID (URL scheme): com.googleusercontent.apps.382102907936-4c72n0fr2uuoltacfqr2c23jrs5fp7fj
- Web analytics: not in use (no Measurement ID required)

Android SHA guidance:

- Register SHA-1 and SHA-256 for both debug and release keystores in Firebase Console > Project Settings > Your Apps > Android.

iOS URL scheme:

- Ensure the reversed client ID is present in Info.plist (already in GoogleService-Info.plist) for Google sign-in.

### Firestore Rules

Located in `firestore.rules`. Deploy with:

```bash
firebase deploy --only firestore:rules
```

Firestore structure and access:

- users/{uid}: owner read/write
- userProfiles/{uid}: owner read/write
- userSettings/{uid}: owner read/write
- All other collections: denied by default

### Realtime Database Rules

Located in `database.rules.json`. Deploy with:

```bash
firebase deploy --only database
```

Realtime Database structure and access:

- users/{uid}/profile: owner read/write (displayName, photoURL)
- users/{uid}/settings: owner read/write (notificationsEnabled, theme)
- All other paths: denied by default

### Storage Rules

Located in `storage.rules`. Deploy with:

```bash
firebase deploy --only storage
```

Storage structure and access:

- users/{uid}/\*\*: owner read/write
- Writes limited to <10 MB and content types: images or PDF
- All other paths: denied by default

## Troubleshooting

### Common Issues

**Firebase CLI not found**

```bash
npm install -g firebase-tools
```

**Not logged in**

```bash
firebase login
```

**Wrong project**

```bash
firebase use expo-firebase-46af7
```

**Permission denied**

Ensure you have the correct IAM roles in Firebase Console.

### Useful Commands

```bash
# Check current project
firebase projects:list

# Switch project
firebase use <project-id>

# View deployed rules
firebase firestore:rules:get

# View function logs
firebase functions:log
```

## Console Links

- [Firebase Console](https://console.firebase.google.com/project/expo-firebase-46af7)
- [Authentication](https://console.firebase.google.com/project/expo-firebase-46af7/authentication)
- [Firestore](https://console.firebase.google.com/project/expo-firebase-46af7/firestore)
- [Realtime Database](https://console.firebase.google.com/project/expo-firebase-46af7/database)
- [Storage](https://console.firebase.google.com/project/expo-firebase-46af7/storage)
- [Functions](https://console.firebase.google.com/project/expo-firebase-46af7/functions)
- [Analytics](https://console.firebase.google.com/project/expo-firebase-46af7/analytics)
- [Crashlytics](https://console.firebase.google.com/project/expo-firebase-46af7/crashlytics)
