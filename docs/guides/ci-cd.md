# CI/CD Guide

Complete guide to the CI/CD pipeline for building, testing, and deploying the Expo Firebase app.

## 📋 Table of Contents

- [Overview](#overview)
- [Branch Strategy](#branch-strategy)
- [Workflow Summary](#workflow-summary)
- [EAS Update (OTA)](#eas-update-ota)
- [EAS Build (Stage)](#eas-build-stage)
- [EAS Build (Production)](#eas-build-production)
- [First Release Process](#first-release-process)
- [GitHub Secrets Setup](#github-secrets-setup)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project uses **Expo Application Services (EAS)** for building and deploying the mobile app. The CI/CD pipeline is built on GitHub Actions and supports:

- **OTA Updates**: Instant JavaScript updates without app store review
- **Native Builds**: Full app builds for iOS and Android
- **Automated Submissions**: Auto-submit to App Store and Play Store

### Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   develop   │────▶│    stage    │────▶│    main     │
│             │     │             │     │             │
│ OTA Updates │     │ OTA Updates │     │ OTA Updates │
│             │     │ + Builds    │     │ + Builds    │
│             │     │ + TestFlight│     │ + Store     │
└─────────────┘     └─────────────┘     └─────────────┘
```

## 🌿 Branch Strategy

| Branch    | Purpose                   | EAS Channel | Build Profile | Distribution           |
| --------- | ------------------------- | ----------- | ------------- | ---------------------- |
| `develop` | Code review & integration | development | development   | OTA only               |
| `stage`   | QA & internal testing     | staging     | preview       | TestFlight / Internal  |
| `main`    | Production releases       | production  | production    | App Store / Play Store |

### Branch Flow

```
feature/xxx ──┐
              │
fix/xxx ──────┼──▶ develop ──▶ stage ──▶ main
              │       │          │         │
docs/xxx ─────┘       │          │         │
                      ▼          ▼         ▼
                   OTA only   TestFlight  Production
                              Internal    App Store
                              Testing     Play Store
```

### When to Use Each Branch

**develop**:

- Merge feature branches here
- Code review happens here
- OTA updates for development testing
- No native builds triggered

**stage**:

- Merge from `develop` when ready for QA
- Triggers preview builds
- Auto-submits to TestFlight (iOS) and Internal Testing (Android)
- QA team tests here before production

**main**:

- Merge from `stage` after QA approval
- Triggers production builds
- Auto-submits to App Store and Play Store
- Users receive the update

## 📜 Workflow Summary

| Workflow              | Trigger                | Actions                                       |
| --------------------- | ---------------------- | --------------------------------------------- |
| `validate.yml`        | Push/PR to any branch  | Lint, format check, typecheck                 |
| `test.yml`            | Push/PR to any branch  | Run tests, upload coverage                    |
| `eas-update.yml`      | Push to main/stage/dev | Publish OTA update to channel                 |
| `eas-build-stage.yml` | Push to stage          | Build preview + submit to TestFlight/Internal |
| `eas-build-prod.yml`  | Push to main           | Build production + submit to stores           |

## 🔄 EAS Update (OTA)

Over-The-Air updates allow you to push JavaScript changes instantly without going through app store review.

### How It Works

1. Code is pushed to `develop`, `stage`, or `main`
2. `eas-update.yml` workflow runs
3. EAS Update publishes to the corresponding channel
4. Apps connected to that channel receive the update

### Channels

| Git Branch | EAS Channel | Who Receives Updates        |
| ---------- | ----------- | --------------------------- |
| `develop`  | development | Development builds          |
| `stage`    | staging     | TestFlight/Internal testers |
| `main`     | production  | Production users            |

### Manual Trigger

You can manually trigger an OTA update from GitHub Actions:

1. Go to **Actions** → **EAS Update (OTA)**
2. Click **Run workflow**
3. Select the branch to update
4. Click **Run workflow**

### Limitations

OTA updates can only update JavaScript code. For these changes, you need a full native build:

- Native module updates
- New native dependencies
- Expo SDK upgrades
- iOS/Android configuration changes
- App icons or splash screens

## 🏗️ EAS Build (Stage)

The stage build workflow creates preview builds for internal testing.

### Trigger

- Automatic: Push to `stage` branch
- Manual: GitHub Actions → EAS Build (Stage) → Run workflow

### What It Does

1. **Build Phase**:
   - Builds iOS app (IPA)
   - Builds Android app (APK/AAB)
   - Uses `preview` profile from `eas.json`

2. **Submit Phase** (after build completes):
   - iOS: Submits to TestFlight
   - Android: Submits to Internal Testing track

### Distribution

| Platform | Distribution Method     | Access                           |
| -------- | ----------------------- | -------------------------------- |
| iOS      | TestFlight              | Invited testers                  |
| Android  | Internal Testing (Play) | Internal testers in Play Console |

### Adding Testers

**iOS (TestFlight)**:

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app → TestFlight
3. Add internal or external testers

**Android (Internal Testing)**:

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app → Testing → Internal testing
3. Create and manage testers list

## 🚀 EAS Build (Production)

The production build workflow creates release builds and submits to app stores.

### Trigger

- Automatic: Push to `main` branch
- Manual: GitHub Actions → EAS Build (Production) → Run workflow

### What It Does

1. **Build Phase**:
   - Builds iOS app (IPA) with production profile
   - Builds Android app (AAB) with production profile
   - Auto-increments version number

2. **Submit Phase** (after build completes):
   - iOS: Submits to App Store Connect
   - Android: Submits to Play Store production track

### Skip Submission

To build without submitting to stores:

1. Go to **Actions** → **EAS Build (Production)**
2. Click **Run workflow**
3. Check **Skip store submission**
4. Click **Run workflow**

## 📱 First Release Process

⚠️ **Important**: The first app submission must be done manually. After the first successful release, automated submissions will work.

### iOS First Release

#### Prerequisites

1. **Apple Developer Account** ($99/year)
2. **App created in App Store Connect**
3. **Certificates and profiles** (EAS handles this)

#### Steps

```bash
# 1. Build production
eas build --profile production --platform ios

# 2. Wait for build to complete, then submit
eas submit --platform ios --latest

# Or download from expo.dev and upload via Transporter app
```

3. Go to [App Store Connect](https://appstoreconnect.apple.com)
4. Complete app information:
   - App description
   - Keywords
   - Screenshots (required sizes)
   - App icon
   - Privacy policy URL
   - Support URL
5. Submit for review

### Android First Release

#### Prerequisites

1. **Google Play Developer Account** ($25 one-time)
2. **App created in Google Play Console**
3. **Google Play Service Account** for automated submissions

#### Steps

```bash
# 1. Build production
eas build --profile production --platform android

# 2. Wait for build to complete, then submit
eas submit --platform android --latest

# Or download AAB from expo.dev and upload manually
```

3. Go to [Google Play Console](https://play.google.com/console)
4. Complete store listing:
   - App description
   - Screenshots (required sizes)
   - Feature graphic
   - Privacy policy URL
5. Complete content rating questionnaire
6. Set up pricing and distribution
7. Submit for review

### Creating Google Play Service Account

For automated Android submissions:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google Play Android Developer API**
4. Create a **Service Account**:
   - IAM & Admin → Service Accounts → Create
   - Grant role: **Service Account User**
5. Create and download JSON key
6. In [Google Play Console](https://play.google.com/console):
   - Setup → API access → Link to Google Cloud project
   - Grant access to the service account
   - Permissions: **Release manager** or **Admin**
7. Add JSON content to GitHub secret `GOOGLE_SERVICE_ACCOUNT_KEY`

## 🔐 GitHub Secrets Setup

Add these secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

### Required Secrets

| Secret                        | Description                                     | How to Get                                                                        |
| ----------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------- |
| `EXPO_TOKEN`                  | EAS authentication token                        | [expo.dev](https://expo.dev) → Access Tokens                                      |
| `APPLE_ID`                    | Apple ID email                                  | Your Apple Developer email                                                        |
| `ASC_APP_ID`                  | App Store Connect App ID                        | App Store Connect → App → General → App ID                                        |
| `APPLE_TEAM_ID`               | Apple Developer Team ID                         | [Developer Portal](https://developer.apple.com) → Membership                      |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password                           | [appleid.apple.com](https://appleid.apple.com) → Security                         |
| `GOOGLE_SERVICE_ACCOUNT_KEY`  | Google Play Service Account JSON (full content) | See [Creating Google Play Service Account](#creating-google-play-service-account) |
| `CODECOV_TOKEN`               | (Optional) Codecov upload token                 | [codecov.io](https://codecov.io)                                                  |

### Creating App-Specific Password (Apple)

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID
3. Security → App-Specific Passwords → Generate
4. Name it (e.g., "GitHub Actions EAS")
5. Copy the generated password
6. Add to GitHub secrets as `APPLE_APP_SPECIFIC_PASSWORD`

### Getting EXPO_TOKEN

1. Go to [expo.dev](https://expo.dev)
2. Sign in to your account
3. Settings → Access Tokens
4. Create a new token (Robot or Personal)
5. Copy and add to GitHub secrets as `EXPO_TOKEN`

## 🔧 Troubleshooting

### Build Fails

**Check EAS dashboard**:

1. Go to [expo.dev](https://expo.dev)
2. Select your project
3. View build logs for detailed errors

**Common issues**:

- Missing native dependencies
- Invalid provisioning profiles (iOS)
- Keystore issues (Android)

### Submission Fails

**iOS**:

- Verify `APPLE_ID`, `ASC_APP_ID`, `APPLE_TEAM_ID` are correct
- Ensure app-specific password is valid
- Check App Store Connect for any required information

**Android**:

- Verify service account has correct permissions
- Ensure app is created in Play Console
- Check for policy violations

### OTA Update Not Showing

1. Verify the app is using the correct channel
2. Check if the update was published successfully in EAS dashboard
3. Restart the app (OTA updates apply on next launch)
4. Verify `expo-updates` is configured correctly

### Manual Commands

```bash
# Check EAS CLI version
eas --version

# Login to EAS
eas login

# View build status
eas build:list

# View update status
eas update:list

# Submit manually
eas submit --platform ios --latest
eas submit --platform android --latest
```

## 📊 Monitoring

### EAS Dashboard

Monitor builds and updates at [expo.dev](https://expo.dev):

- Build status and logs
- Update history
- Channel configurations
- Team access

### GitHub Actions

View workflow runs at:
`https://github.com/YOUR_ORG/YOUR_REPO/actions`

- Workflow execution logs
- Job summaries
- Artifact downloads

## 🔗 Related Guides

- [Development Guide](development.md) - Development workflow
- [Configuration Guide](configuration.md) - EAS and Expo configuration
- [Project Overview](project-overview.md) - Architecture overview

---

**Questions?** Open an issue on [GitHub](https://github.com/Barthmossr/expo-firebase/issues).
