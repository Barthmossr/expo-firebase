import { setGlobalOptions } from 'firebase-functions/v2/options'
import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import * as admin from 'firebase-admin'
import { sendOTPEmail } from './otp/send-otp-email.function'
import { verifyOTPEmail } from './otp/verify-otp-email.function'
import { cleanupExpiredRegistrations } from './cleanup'
import { REGION } from './config/firebase.constants'

admin.initializeApp()

setGlobalOptions({ region: REGION, maxInstances: 10 })

export const health = onRequest(
  { cors: true, memory: '128MiB', timeoutSeconds: 10 },
  (request, response) => {
    logger.info('healthcheck', { path: request.path })
    response
      .status(200)
      .json({ status: 'ok', timestamp: new Date().toISOString() })
  },
)

export { sendOTPEmail, verifyOTPEmail, cleanupExpiredRegistrations }
