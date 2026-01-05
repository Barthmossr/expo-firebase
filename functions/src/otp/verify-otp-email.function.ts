import { onCall, HttpsError } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import { compareHash, isOTPExpired } from './otp.utils'
import type { VerifyOTPRequest, OTPVerificationResult } from './otp.types'
import { REGION } from '../config/firebase.constants'

const MAX_FAILED_ATTEMPTS = 5

const verifyOTPEmail = onCall(
  {
    region: REGION,
    memory: '128MiB',
    timeoutSeconds: 30,
  },
  async (request): Promise<OTPVerificationResult> => {
    const data = request.data as VerifyOTPRequest
    const { email, code } = data

    if (!email || !code) {
      throw new HttpsError('invalid-argument', 'Email and code are required')
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      throw new HttpsError('invalid-argument', 'Code must be 6 digits')
    }

    try {
      const db = admin.firestore()
      const pendingRef = db.collection('pending_registrations').doc(email)
      const pendingDoc = await pendingRef.get()

      if (!pendingDoc.exists) {
        throw new HttpsError('not-found', 'No pending registration found')
      }

      const pendingData = pendingDoc.data()

      if (!pendingData) {
        throw new HttpsError('not-found', 'Invalid registration data')
      }

      if (pendingData.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        await pendingRef.delete()
        throw new HttpsError(
          'permission-denied',
          'Too many failed attempts. Please register again',
        )
      }

      if (isOTPExpired(pendingData.otpExpiresAt)) {
        await pendingRef.delete()

        const mailQuery = db.collection('mail').where('to', '==', email)
        const mailSnapshot = await mailQuery.get()
        if (!mailSnapshot.empty) {
          const mailBatch = db.batch()
          mailSnapshot.docs.forEach((doc) => {
            mailBatch.delete(doc.ref)
          })
          await mailBatch.commit()
        }

        throw new HttpsError(
          'deadline-exceeded',
          'Verification code has expired',
        )
      }

      const isValid = await compareHash(code, pendingData.otpHash)

      if (!isValid) {
        await pendingRef.update({
          failedAttempts: admin.firestore.FieldValue.increment(1),
        })

        const remainingAttempts =
          MAX_FAILED_ATTEMPTS - (pendingData.failedAttempts + 1)

        if (remainingAttempts <= 0) {
          await pendingRef.delete()
          throw new HttpsError(
            'permission-denied',
            'Too many failed attempts. Please register again',
          )
        }

        return {
          success: false,
          error: `Invalid code. ${remainingAttempts} attempts remaining`,
        }
      }

      await pendingRef.delete()

      const mailQuery = db.collection('mail').where('to', '==', email)
      const mailSnapshot = await mailQuery.get()
      if (!mailSnapshot.empty) {
        const mailBatch = db.batch()
        mailSnapshot.docs.forEach((doc) => {
          mailBatch.delete(doc.ref)
        })
        await mailBatch.commit()
      }

      return {
        success: true,
        email: pendingData.email,
        displayName: pendingData.displayName,
        password: pendingData.password,
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)

      if (error instanceof HttpsError) {
        throw error
      }

      throw new HttpsError('internal', 'Failed to verify code')
    }
  },
)

export { verifyOTPEmail }
