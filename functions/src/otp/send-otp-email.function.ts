import { onCall, HttpsError } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import { generateOTP, hashString, createExpiryTimestamp } from './otp.utils'
import type { SendOTPRequest } from './otp.types'

const MAX_RESEND_PER_HOUR = 3
const OTP_EXPIRY_MINUTES = 10
const RESEND_COOLDOWN_MINUTES = 1

const sendOTPEmail = onCall(
  {
    region: 'southamerica-east1',
    memory: '128MiB',
    timeoutSeconds: 30,
  },
  async (request): Promise<{ success: boolean; message: string }> => {
    const data = request.data as SendOTPRequest & { resend?: boolean }
    const { email, displayName, password, resend } = data

    if (!email) {
      throw new HttpsError('invalid-argument', 'Email is required')
    }

    if (!resend && (!displayName || !password)) {
      throw new HttpsError(
        'invalid-argument',
        'DisplayName and password are required for new registrations',
      )
    }

    if (!email.includes('@')) {
      throw new HttpsError('invalid-argument', 'Invalid email format')
    }

    try {
      const db = admin.firestore()
      const pendingRef = db.collection('pending_registrations').doc(email)
      const existingDoc = await pendingRef.get()

      if (resend && !existingDoc.exists) {
        throw new HttpsError(
          'not-found',
          'No pending registration found for this email',
        )
      }

      let finalDisplayName = displayName
      let finalPassword = password

      if (resend && existingDoc.exists) {
        const existingData = existingDoc.data()
        finalDisplayName = existingData?.displayName || displayName
        finalPassword = existingData?.password || password
      }

      if (!finalDisplayName || !finalPassword) {
        throw new HttpsError(
          'invalid-argument',
          'Registration data is incomplete',
        )
      }

      if (existingDoc.exists) {
        const existing = existingDoc.data()
        const now = admin.firestore.Timestamp.now()

        if (
          existing?.resendCount &&
          existing.resendCount >= MAX_RESEND_PER_HOUR
        ) {
          const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
          const hourAgoTimestamp = admin.firestore.Timestamp.fromDate(hourAgo)

          if (
            existing.lastResendAt &&
            existing.lastResendAt.toMillis() > hourAgoTimestamp.toMillis()
          ) {
            throw new HttpsError(
              'resource-exhausted',
              'Too many attempts. Please try again later',
            )
          }
        }

        if (existing?.lastResendAt) {
          const cooldownEnd = new Date(
            existing.lastResendAt.toMillis() +
              RESEND_COOLDOWN_MINUTES * 60 * 1000,
          )
          if (now.toMillis() < cooldownEnd.getTime()) {
            throw new HttpsError(
              'resource-exhausted',
              'Please wait before requesting a new code',
            )
          }
        }
      }

      const otp = generateOTP()
      const otpHash = await hashString(otp)
      const passwordHash = resend
        ? finalPassword
        : await hashString(finalPassword)
      const otpExpiresAt = createExpiryTimestamp(admin, OTP_EXPIRY_MINUTES)
      const now = admin.firestore.Timestamp.now()

      const resendCount = existingDoc.exists
        ? (existingDoc.data()?.resendCount || 0) + 1
        : 0

      await pendingRef.set({
        email,
        displayName: finalDisplayName,
        password: passwordHash,
        otpHash,
        otpExpiresAt,
        failedAttempts: 0,
        resendCount,
        lastResendAt: now,
        createdAt: existingDoc.exists ? existingDoc.data()?.createdAt : now,
      })

      await db.collection('mail').add({
        to: email,
        message: {
          subject: 'Verify Your Email - Registration Code',
          text: `Hello ${finalDisplayName},\n\nYour verification code is: ${otp}\n\nThis code will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you did not request this code, please ignore this email.\n\nBest regards,\nYour App Team`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Verify Your Email</h2>
              <p>Hello <strong>${finalDisplayName}</strong>,</p>
              <p>Your verification code is:</p>
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #666;">This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
              <p style="color: #999; font-size: 12px;">If you did not request this code, please ignore this email.</p>
            </div>
          `,
        },
      })

      console.info(`OTP sent to ${email}`)

      return {
        success: true,
        message: 'Verification code sent successfully',
      }
    } catch (error) {
      console.error('Error sending OTP:', error)

      if (error instanceof HttpsError) {
        throw error
      }

      throw new HttpsError('internal', 'Failed to send verification code')
    }
  },
)

export { sendOTPEmail }
