# Firebase Email Templates Configuration

Complete guide to customize Firebase authentication email templates for better deliverability and branding.

## Overview

Firebase Authentication provides built-in email templates for:

- Password reset emails
- Email verification
- Email change notifications

By customizing these templates and using `ActionCodeSettings`, you can:

- Improve email deliverability (avoid spam folders)
- Add consistent branding
- Create better user experience
- Enable deep linking to your mobile app

## Prerequisites

- Firebase project with Authentication enabled
- Email/Password sign-in method enabled
- Admin access to Firebase Console

---

## Step 1: Configure ActionCodeSettings (Already Implemented)

The project already includes `ActionCodeSettings` configuration that automatically reads from your `app.config.ts`:

**File:** `src/adapters/firebase/auth/firebase-auth.constants.ts`

```typescript
export const getActionCodeSettings =
  (): FirebaseAuthTypes.ActionCodeSettings => {
    const iosBundleId = Constants.expoConfig?.ios?.bundleIdentifier
    const androidPackage = Constants.expoConfig?.android?.package
    const projectId = Constants.expoConfig?.extra?.['firebase']?.projectId

    if (!iosBundleId) {
      throw new Error('iOS bundle identifier is required in app.config.ts')
    }

    if (!androidPackage) {
      throw new Error('Android package name is required in app.config.ts')
    }

    if (!projectId) {
      throw new Error(
        'Firebase project ID is required in app.config.ts extra.firebase.projectId',
      )
    }

    return {
      url: `https://${projectId}.firebaseapp.com/reset-password`,
      handleCodeInApp: true,
      iOS: { bundleId: iosBundleId },
      android: { packageName: androidPackage, installApp: true },
    }
  }
```

### What This Does

- **Reads from app.config.ts** - No hardcoded values, throws errors if missing
- **Uses HTTPS URL** - Firebase automatically converts to deep link (`expofirebase://reset-password?oobCode=...`)
- **handleCodeInApp: true** - Enables deep linking to your app
- **Better deliverability** - Properly configured sender improves inbox placement
- **Lazy loaded with cache** - Performance optimization for repeated calls

### Update Configuration

All configuration is in **`app.config.ts`**:

1. Bundle IDs automatically read from:
   - `ios.bundleIdentifier`
   - `android.package`
   - `extra.firebase.projectId`

2. No manual updates needed in constants file
3. Just update `app.config.ts` and rebuild

**Note:** The function throws clear errors if any required configuration is missing - no silent fallbacks or default values.

---

## Step 2: Customize Email Templates in Firebase Console

### 2.1 Access Templates

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Templates** (left sidebar)
4. Click on **Password reset** template

### 2.2 Template Customization Options

#### Subject Line

- Default: `Reset your password for %APP_NAME%`
- Recommendation: Keep it clear and actionable
- Example: `Reset your password`

#### Body Text

You can customize the email body with HTML and placeholders:

**Available Placeholders:**

- `%APP_NAME%` - Your Firebase project name
- `%EMAIL%` - User's email address
- `%LINK%` - Password reset action link (required)

**Example Custom Template:**

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .logo {
        text-align: center;
        margin-bottom: 30px;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #4285f4;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Add your logo here -->
      <div class="logo">
        <h2>%APP_NAME%</h2>
      </div>

      <h1>Reset Your Password</h1>

      <p>Hello,</p>

      <p>
        We received a request to reset the password for your account (%EMAIL%).
      </p>

      <p>Click the button below to reset your password:</p>

      <a href="%LINK%" class="button">Reset Password</a>

      <p>
        If you didn't request this, you can safely ignore this email. Your
        password will remain unchanged.
      </p>

      <p>This link will expire in 1 hour for security reasons.</p>

      <div class="footer">
        <p>
          If the button doesn't work, copy and paste this link into your
          browser:
        </p>
        <p>%LINK%</p>
      </div>
    </div>
  </body>
</html>
```

#### Additional Customizations

- **From Name:** Change sender name (default: "noreply@your-project.firebaseapp.com")
- **Reply-To:** Add a support email for replies
- **Add Logo:** Upload your app logo (recommended for brand recognition)

### 2.3 Best Practices for Deliverability

To avoid spam folders:

1. **Use Plain Text Alternative**
   - Always provide plain text version alongside HTML
   - Firebase console allows both formats

2. **Keep It Simple**
   - Avoid excessive images
   - Don't use words like "FREE", "URGENT", "ACT NOW"
   - Keep email size under 100KB

3. **Add Unsubscribe Link (Optional)**
   - Good practice for transactional emails
   - Shows email providers you're legitimate

4. **Test Before Production**
   - Send test emails to yourself
   - Check spam folder
   - Test on multiple email providers (Gmail, Outlook, Yahoo)

---

## Step 3: Verify Email Configuration

### 3.1 Check Current Configuration

In Firebase Console:

1. **Authentication** → **Settings** → **Authorized Domains**
2. Ensure your domains are listed:
   - `localhost` (for development)
   - Your production domain
   - `your-project.firebaseapp.com`

### 3.2 Test Email Delivery

Run this test in your app:

```typescript
import { getAuthService } from '@/services/auth'

const testPasswordReset = async () => {
  try {
    const authService = getAuthService()
    await authService.sendPasswordResetEmail('your-test-email@example.com')
    console.log('Password reset email sent successfully')
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
```

Check:

- Email arrives in inbox (not spam)
- Template looks correct
- Link works properly
- Deep linking works on mobile

---

## Step 4: Advanced Configuration (Optional)

### 4.1 Custom Email Handler (Web)

If you have a web version, you can handle password reset in your own domain:

1. Update `ACTION_CODE_SETTINGS`:

```typescript
const ACTION_CODE_SETTINGS = {
  url: 'https://yourdomain.com/reset-password',
  handleCodeInApp: false, // Handle in web
  iOS: { bundleId: 'com.expofirebase' },
  android: { packageName: 'com.expofirebase' },
}
```

2. Create custom handler page at `https://yourdomain.com/reset-password`

### 4.2 SMTP Configuration (Enterprise)

For high-volume or custom sender:

1. Use Firebase Extensions: **Trigger Email from Firestore**
2. Configure with SendGrid, Mailgun, or AWS SES
3. See `docs/services/sendgrid/setup.md` for details

---

## Step 5: Monitor Email Delivery

### 5.1 Firebase Console Monitoring

Check email activity:

1. **Authentication** → **Users**
2. View user activity logs
3. Check for email bounce rates

### 5.2 Common Issues

**Emails going to spam:**

- Add your logo to template
- Use simple, professional language
- Ensure ACTION_CODE_SETTINGS is properly configured
- Consider custom domain for enterprise

**Emails not arriving:**

- Check authorized domains in Firebase Console
- Verify user email is correct
- Check Firebase quota limits (free tier: 100 emails/day for password reset)
- Check user's spam folder

**Links not working:**

- Verify bundle IDs match your app
- Test deep linking configuration
- Check authorized domains include your app domain

---

## Production Checklist

Before going live:

- [ ] Password reset email template customized
- [ ] Logo added to email template
- [ ] Test emails sent to multiple providers (Gmail, Outlook, Yahoo)
- [ ] Emails landing in inbox (not spam)
- [ ] ACTION_CODE_SETTINGS bundle IDs match production app
- [ ] Deep linking tested on iOS and Android
- [ ] Authorized domains configured correctly
- [ ] From name and reply-to configured
- [ ] Plain text version provided
- [ ] Email link expiration tested (1 hour default)

---

## Firebase Quota Limits

**Free Tier (Spark Plan):**

- Password reset emails: Unlimited (part of Authentication)
- Email verification: Unlimited
- No cost for Firebase Authentication emails

**Note:** If using custom SMTP (SendGrid, etc.), their pricing applies.

---

## Security Considerations

1. **Link Expiration**
   - Password reset links expire in 1 hour (Firebase default)
   - Cannot be changed via ActionCodeSettings
   - Users must request new link if expired

2. **One-Time Use**
   - Reset links can only be used once
   - After reset, link becomes invalid

3. **Rate Limiting**
   - Firebase automatically rate-limits email requests
   - Prevents abuse and spam

4. **OAuth Users**
   - Project now detects OAuth-only users
   - Shows appropriate message instead of sending reset email
   - See implementation in login and forgot-password forms

---

## Additional Resources

- [Firebase Authentication Email Templates](https://firebase.google.com/docs/auth/custom-email-handler)
- [ActionCodeSettings Documentation](https://firebase.google.com/docs/reference/js/auth.actioncodesettings)
- [Email Deliverability Best Practices](https://developers.google.com/gmail/api/guides/sending)
- [Firebase Authentication Quotas](https://firebase.google.com/docs/auth/limits)

---

## Support

For issues:

1. Check Firebase Console logs: **Authentication** → **Usage**
2. Test emails with different providers
3. Verify configuration in this document
4. Check Firebase Status: [status.firebase.google.com](https://status.firebase.google.com/)

For critical issues, contact [Firebase Support](https://firebase.google.com/support)
