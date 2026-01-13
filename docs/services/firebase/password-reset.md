# Password Reset - Architecture

## Overview

Password reset implementation using Firebase Authentication with deep linking support for native mobile apps.

## Architecture

### Flow Diagram

```
User → Forgot Password → Firebase sends email → User clicks link
    → Deep link opens app → Verify code → Set new password → Success
```

## Components

### 1. ActionCodeSettings Configuration

**File:** `src/adapters/firebase/auth/firebase-auth.constants.ts`

```typescript
{
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
```

**Key Points:**

- URL dynamically built from `app.config.ts` (`extra.firebase.projectId`)
- Firebase automatically appends `oobCode` parameter
- `handleCodeInApp: true` enables deep linking
- No default values - throws errors if config is missing

### 2. Deep Link Handler

**File:** `src/app/_layout.tsx`

Intercepts URLs when app opens via `expo-linking`:

```typescript
Linking.addEventListener('url', (event) => {
  const parsed = Linking.parse(url)
  const oobCode = parsed.queryParams?.['oobCode']
  if (oobCode) {
    router.push(`/(auth)/reset-password?oobCode=${oobCode}`)
  }
})
```

**Features:**

- Multiple URL format support
- Falls back to manual URL parsing if needed
- Uses bracket notation for index signatures
- Gets projectId from environment config

### 3. Reset Password Screen

**File:** `src/app/(auth)/reset-password.tsx`

**States:**

- `isVerifying`: Checking if code is valid
- `email`: User email from verified code
- `error`: Invalid/expired code message

**Flow:**

1. Extract `oobCode` from route params
2. Call `verifyPasswordResetCode(oobCode)` → Returns email
3. Show form if valid, error message if invalid
4. Pass code to form component

### 4. Reset Password Form

**File:** `src/flows/auth/components/reset-password-form/`

**Validation Schema:**

```typescript
password: z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

confirmPassword: z.string().refine(
  (val) => val === password,
  'Passwords must match',
)
```

**States:**

- `isLoading`: Submitting form
- `isSuccess`: Password changed successfully
- `error`: Form submission error

**UI Flow:**

1. Show email (read-only)
2. Two password inputs (new + confirm)
3. On submit → Call `confirmPasswordReset(code, password)`
4. Show success message for 2 seconds
5. Navigate to login screen

## Firebase Auth Methods

### verifyPasswordResetCode

```typescript
verifyPasswordResetCode(code: string): Promise<string>
```

**Purpose:** Validates the reset code and returns the associated email

**Returns:** Email address if code is valid

**Throws:**

- `auth/invalid-action-code`: Code is invalid
- `auth/expired-action-code`: Code has expired (default: 1 hour)

### confirmPasswordReset

```typescript
confirmPasswordReset(code: string, newPassword: string): Promise<void>
```

**Purpose:** Confirms the password reset and updates the user's password

**Throws:**

- `auth/invalid-action-code`: Code is invalid or already used
- `auth/expired-action-code`: Code has expired
- `auth/weak-password`: Password doesn't meet requirements

### sendPasswordResetEmail

```typescript
sendPasswordResetEmail(email: string): Promise<void>
```

**Purpose:** Sends password reset email to user

**Features:**

- Uses ActionCodeSettings for deep linking
- Always succeeds (doesn't reveal if email exists)
- Email only sent if account exists (security feature)

## Configuration Requirements

### App Config (app.config.ts)

Required in `extra.firebase`:

```typescript
{
  extra: {
    firebase: {
      projectId: 'your-project-id', // REQUIRED
    }
  },
  ios: {
    bundleIdentifier: 'com.your.app', // REQUIRED
  },
  android: {
    package: 'com.your.app', // REQUIRED
  },
  scheme: 'yourapp', // REQUIRED for deep linking
}
```

### Firebase Console

1. **Authentication → Templates → Password reset**
   - Customize email template
   - Use variables: `%LINK%`, `%EMAIL%`, `%APP_NAME%`

2. **Authentication → Settings → Authorized domains**
   - Add `{projectId}.firebaseapp.com` (auto-added)
   - Add custom domains if needed

3. **Platform Setup**
   - iOS: Register bundle ID
   - Android: Register package name + SHA-256 fingerprint

## Security Features

1. **Single-use codes:** Each oobCode can only be used once
2. **Time-limited:** Codes expire after 1 hour (default)
3. **HTTPS only:** Firebase only accepts HTTPS URLs (except localhost)
4. **Email enumeration protection:** API doesn't reveal if email exists
5. **No code in email body:** Code only embedded in secure link

## Testing

### Unit Tests

**Coverage:**

- ActionCodeSettings creation with/without config
- verifyPasswordResetCode (success/invalid/expired)
- confirmPasswordReset (success/invalid/expired)
- Deep link URL parsing
- Form validation and submission

**Location:** `tests/unit/adapters/firebase/auth/`

### Manual Testing

See: [Password Reset Testing Guide](../../guides/password-reset-deep-link.md)

## Error Handling

### Common Errors

| Error Code                 | Meaning                            | User Message                                                           |
| -------------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `auth/invalid-action-code` | Code is invalid or already used    | "This reset link is invalid or has expired"                            |
| `auth/expired-action-code` | Code has expired (>1 hour)         | "This reset link has expired"                                          |
| `auth/weak-password`       | Password doesn't meet requirements | "Password must be at least 8 characters with 1 uppercase and 1 number" |
| `auth/user-not-found`      | Email doesn't exist                | Returns success (security)                                             |

### Error Mapping

**File:** `src/adapters/firebase/auth/firebase-auth.utils.ts`

All Firebase errors are mapped to consistent error codes in the auth port interface.

## Troubleshooting

### Deep link not working

1. Verify `scheme` in app.config.ts
2. Rebuild app after config changes
3. Check deep link logs in \_layout.tsx
4. Test with manual URL: `yourapp://reset-password?oobCode=test`

### Code always invalid

1. Code may have already been used
2. Code may have expired (check timestamp)
3. Bundle ID/package name mismatch in config

### Email not delivered

1. Check spam folder
2. Verify domain is authorized in Firebase Console
3. Ensure email exists in Firebase (security: API won't reveal)

## Future Enhancements

1. **Firebase Dynamic Links**
   - Better web fallback
   - Universal links support
   - Deep link analytics

2. **Custom Email Service**
   - Use SendGrid/AWS SES
   - Custom email templates
   - Better deliverability

3. **Rate Limiting**
   - Prevent abuse
   - Firebase Functions-based throttling

4. **Resend Code**
   - Allow user to request new code
   - Track attempts in Firestore
