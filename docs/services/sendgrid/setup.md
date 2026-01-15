# Email Verification Setup Guide

Complete guide to configure the OTP email verification system using SendGrid and Firebase.

## Overview

The email verification system uses:

- **SendGrid**: Email delivery service
- **Firebase Extension**: Trigger Email from Firestore
- **Cloud Functions**: OTP generation and verification logic
- **Firestore**: Temporary storage for pending registrations and email queue

## Prerequisites

- Firebase project created and configured
- Firebase CLI installed (`npm install -g firebase-tools`)
- SendGrid account (free tier works)
- Node.js 22 installed

---

## Step 1: SendGrid Configuration

### 1.1 Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for a free account (100 emails/day limit)
3. Verify your email address

### 1.2 Generate API Key

1. Log in to SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it: `Firebase Email Extension`
5. Choose **Full Access** (or at minimum: Mail Send permissions)
6. Click **Create & View**
7. **Copy the API key immediately** (you won't see it again)

Example format: `SG.xxxxxxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`

### 1.3 Verify Sender Identity

**Important**: SendGrid requires sender verification for free accounts.

1. Go to **Settings** → **Sender Authentication**
2. Choose one option:

   **Option A: Single Sender Verification (Easiest)**
   - Click **Verify a Single Sender**
   - Enter your email (e.g., `noreply@yourdomain.com` or personal email)
   - Fill in the form (name, address, etc.)
   - Check your email and click verification link

   **Option B: Domain Authentication (Production)**
   - Click **Authenticate Your Domain**
   - Follow DNS setup instructions
   - Wait for DNS propagation (up to 48 hours)

---

## Step 2: Firebase Extension Installation

### 2.1 Install "Trigger Email from Firestore"

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Build** → **Extensions** → **Extensions Hub**
4. Search for **"Trigger Email from Firestore"**
5. Click **Install**

### 2.2 Configure Extension

During installation, provide these values:

| Parameter                    | Value                                  | Description                               |
| ---------------------------- | -------------------------------------- | ----------------------------------------- |
| **Cloud Functions location** | `southamerica-east1`                   | Must match your functions region          |
| **Mail collection**          | `mail`                                 | Collection to monitor for emails          |
| **SMTP connection URI**      | `smtps://apikey@smtp.sendgrid.net:465` | SendGrid SMTP server                      |
| **SMTP password**            | Your SendGrid API Key                  | API key from Step 1.2 (e.g., `SG.xxx...`) |
| **Email from address**       | Verified sender email                  | Must match verified sender from Step 1.3  |
| **Email from name**          | Your App Name                          | Display name in emails                    |
| **Default reply-to address** | Your support email                     | Where replies go                          |

**Important**: The SMTP connection URI and password are entered in **separate fields**:

- **SMTP connection URI**: `smtps://apikey@smtp.sendgrid.net:465`
- **SMTP password**: Paste your full SendGrid API key (e.g., `SG.xxxxxxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`)

### 2.3 Grant Permissions

The extension will ask for permissions to:

- Read from Firestore `mail` collection
- Send emails via SMTP
- Write delivery status back to Firestore

Click **Allow** to proceed.

---

## Step 3: Firestore Security Rules

### 3.1 Update firestore.rules

Ensure your `firestore.rules` file contains:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Deny all client access to mail collection
    // Only Cloud Functions and Extensions can write here
    match /mail/{mailId} {
      allow read, write: if false;
    }

    // Deny all client access to pending registrations
    // Only Cloud Functions can access
    match /pending_registrations/{email} {
      allow read, write: if false;
    }

    // Your other rules...
  }
}
```

### 3.2 Deploy Rules

```bash
firebase deploy --only firestore:rules
```

---

## Step 4: Cloud Functions Deployment

### 4.1 Verify Configuration

Check `functions/src/index.ts`:

```typescript
setGlobalOptions({
  region: 'southamerica-east1', // Must match extension region
  maxInstances: 10,
})
```

### 4.2 Deploy Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

**Expected output:**

```
✔ functions[sendOTPEmail(southamerica-east1)]
✔ functions[verifyOTPEmail(southamerica-east1)]
✔ functions[cleanupExpiredRegistrations(southamerica-east1)]
```

### 4.3 Note Function URLs

After deployment, copy the function URLs:

```
https://southamerica-east1-YOUR_PROJECT.cloudfunctions.net/sendOTPEmail
https://southamerica-east1-YOUR_PROJECT.cloudfunctions.net/verifyOTPEmail
```

---

## Step 5: Client Configuration

### 5.1 Update Firebase OTP Adapter

In `src/adapters/firebase/otp/firebase-otp.adapter.ts`, ensure URLs match:

```typescript
const sendOTPEmail = httpsCallableFromUrl(
  functions,
  'https://southamerica-east1-YOUR_PROJECT.cloudfunctions.net/sendOTPEmail',
)

const verifyOTPEmail = httpsCallableFromUrl(
  functions,
  'https://southamerica-east1-YOUR_PROJECT.cloudfunctions.net/verifyOTPEmail',
)
```

Replace `YOUR_PROJECT` with your Firebase project ID.

---

## Step 6: Testing

### 6.1 Test Registration Flow

1. Start your app: `npm start`
2. Navigate to registration screen
3. Enter test user details
4. Submit form
5. Check your email inbox for 6-digit code
6. Enter code in verification screen

### 6.2 Verify in Firebase Console

**Check Firestore:**

1. Go to **Firestore Database**
2. Look for `pending_registrations` collection
3. You should see a document with your email
4. Check `mail` collection for queued email
5. After delivery, mail document should have `delivery` field

**Check Cloud Functions logs:**

```bash
firebase functions:log --only sendOTPEmail
firebase functions:log --only verifyOTPEmail
```

**Check SendGrid Activity:**

1. Go to SendGrid dashboard
2. Click **Activity**
3. You should see "Delivered" status for your email

### 6.3 Test Scenarios

- ✅ **New registration**: Email arrives within 30s
- ✅ **Resend code**: Wait 60s, click resend
- ✅ **Wrong code**: Enter invalid code, see error
- ✅ **Expired code**: Wait 10 minutes, code should expire
- ✅ **Max attempts**: Try 5 wrong codes, registration deleted

---

## Step 7: Firestore Indexes

### 7.1 Required Indexes

Create these indexes in Firebase Console:

1. **Collection**: `pending_registrations`
   - Field: `createdAt`
   - Order: Ascending
   - Query scope: Collection

2. **Collection**: `mail`
   - Field: `delivery.startTime`
   - Order: Ascending
   - Query scope: Collection

3. **Collection**: `mail`
   - Field: `to`
   - Order: Ascending
   - Query scope: Collection

### 7.2 Create Indexes

**Option A: Via Firebase Console**

1. Go to **Firestore Database** → **Indexes**
2. Click **Create Index**
3. Enter collection and field details
4. Click **Create**

**Option B: Via firestore.indexes.json**

Add to `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "pending_registrations",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "createdAt",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "mail",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "delivery.startTime",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "mail",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "to",
          "order": "ASCENDING"
        }
      ]
    }
  ]
}
```

Then deploy:

```bash
firebase deploy --only firestore:indexes
```

---

## Configuration Summary

### Environment Variables (if needed)

None required! Everything is configured through:

- Firebase Extension settings (SMTP URI and password in separate fields)
- Cloud Functions code (region, timeouts, memory)
- Firestore rules (security)

### OTP Settings

Configured in `functions/src/otp/send-otp-email.function.ts`:

```typescript
const MAX_RESEND_PER_HOUR = 3 // Max resend attempts
const OTP_EXPIRY_MINUTES = 10 // Code expires after 10 min
const RESEND_COOLDOWN_MINUTES = 1 // Wait 1 min between resends
```

### Security Settings

Configured in `functions/src/otp/verify-otp-email.function.ts`:

```typescript
const MAX_FAILED_ATTEMPTS = 5 // Max wrong code attempts
```

---

## Troubleshooting

### Email Not Received

**1. Check SendGrid Activity**

- Go to SendGrid dashboard → Activity
- Look for your email address
- Check status: Processed, Delivered, or Bounced

**2. Check Spam Folder**

- Emails from new SendGrid accounts often go to spam
- Mark as "Not Spam" to train filter

**3. Check Firestore `mail` Collection**

- Document should exist with your email
- Check for `delivery.error` field
- If no document, Cloud Function didn't execute

**4. Check Function Logs**

```bash
firebase functions:log --only sendOTPEmail
```

Look for errors or "OTP sent to [email]" message

**5. Verify SendGrid API Key**

- Ensure API key has "Mail Send" permission
- Check SMTP connection URI: `smtps://apikey@smtp.sendgrid.net:465`
- Check SMTP password field contains your full API key (starts with `SG.`)
- Do not include the API key in the SMTP URI

**6. Verify Sender Identity**

- SendGrid requires verified sender
- Check Settings → Sender Authentication
- Sender email must match "from" address in extension

### Function Errors

**"Failed to send verification code"**

- Check function logs for detailed error
- Verify Firestore rules allow function access
- Check region matches (southamerica-east1)

**"No pending registration found"**

- Registration may have expired (>1 hour old)
- Check `pending_registrations` collection
- Try registering again

**"Too many attempts"**

- 5 wrong codes entered, registration deleted
- User must start registration from beginning

**"Code expired"**

- OTP older than 10 minutes
- Click "Resend Code" to get new one

### Extension Issues

**Extension not triggering**

- Check extension status in Firebase Console
- Verify `mail` collection name matches extension config
- Check extension logs in Cloud Functions

**SMTP connection failed**

- Verify SMTP URI: `smtps://apikey@smtp.sendgrid.net:465`
- Verify SMTP password field contains valid SendGrid API key
- Check API key has "Mail Send" permissions
- Ensure port 465 is not blocked

---

## Production Checklist

Before going live:

- [ ] SendGrid sender verified (domain authentication for production)
- [ ] Firestore rules deployed and tested
- [ ] Cloud Functions deployed to correct region
- [ ] Firestore indexes created
- [ ] Email delivery tested end-to-end
- [ ] SendGrid API key secured (not in source control)
- [ ] Billing alerts configured in Firebase Console
- [ ] SendGrid account upgraded if >100 emails/day needed
- [ ] Custom email template designed (optional)
- [ ] Error monitoring set up (Firebase Crashlytics)

---

## Additional Resources

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Firebase Extensions](https://firebase.google.com/products/extensions)
- [Trigger Email Extension Docs](https://github.com/firebase/extensions/tree/master/firestore-send-email)
- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## Support

If you encounter issues:

1. Check Firebase Functions logs: `firebase functions:log`
2. Check SendGrid Activity dashboard
3. Review Firestore rules and indexes
4. Check extension configuration in Firebase Console
5. Verify all credentials are correct

For SendGrid issues, contact [SendGrid Support](https://support.sendgrid.com/)
For Firebase issues, check [Firebase Support](https://firebase.google.com/support)
