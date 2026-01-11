# Testing Password Reset with Deep Link

## Complete Flow

1. **User requests reset:**
   - Open app → "Forgot Password"
   - Enter email → "Send Reset Link"
   - Email sent by Firebase

2. **Firebase sends email:**
   - Email contains link: `https://{projectId}.firebaseapp.com/reset-password?oobCode=ABC123...`
   - When clicked, Firebase redirects to app deep link

3. **App intercepts deep link:**
   - `_layout.tsx` captures URL
   - Extracts `oobCode`
   - Navigates to `/(auth)/reset-password`

4. **Reset screen:**
   - Verifies code with `verifyPasswordResetCode(oobCode)`
   - Shows form with email
   - User enters new password + confirmation
   - Calls `confirmPasswordReset(oobCode, newPassword)`
   - Success → Shows success screen → Navigates to login

## Testing on Emulator

### 1. Send email (in app)

```
Forgot Password → Enter email → Send Reset Link
```

### 2. Get the oobCode

Firebase will generate a link like:

```
https://{projectId}.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=lpCfOZ7tyJQFuBykAIlpmJkyTDZW5hvO-FGqqw7_2TEAAAGbngOTbQ&...
```

**Extract oobCode:** Copy only the part after `oobCode=` until the next `&`

### 3. Simulate deep link on emulator

**Android:**

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "expofirebase://reset-password?oobCode=YOUR_CODE_HERE"
```

**iOS:**

```bash
xcrun simctl openurl booted \
  "expofirebase://reset-password?oobCode=YOUR_CODE_HERE"
```

### 4. Verify in app

The app should:

- ✅ Open automatically
- ✅ Show "Verifying reset link..."
- ✅ Display form with email
- ✅ Allow password change
- ✅ Show success message
- ✅ Redirect to login after success

## Debugging Issues

### Deep link doesn't open app

**Check scheme registration:**

```bash
# Android
adb shell dumpsys package | grep -A5 expofirebase

# iOS - Rebuild
npx expo run:ios --clean
```

### View deep link logs

In the code (`_layout.tsx`), the deep link handler will show in logs:

- Received URL
- Parsed URL
- Extracted oobCode

### Invalid/expired code

If the code is invalid, you'll see:

- "This reset link is invalid or has expired"
- "Back to Login" button

## Production

In production, when user clicks the email link:

1. If app is installed → Opens directly in app
2. If app is not installed → Opens on web (can have fallback)

## Customizing Email

In Firebase Console:

```
Authentication → Templates → Password reset
```

You can customize:

- Subject
- Email body
- Button text
- Use variables: %LINK%, %EMAIL%, %APP_NAME%

The `%LINK%` will automatically be: `https://{projectId}.firebaseapp.com/reset-password?oobCode=...`
