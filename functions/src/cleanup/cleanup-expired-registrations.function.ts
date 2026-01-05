import { onSchedule } from 'firebase-functions/v2/scheduler'
import * as admin from 'firebase-admin'
import { REGION } from '../config/firebase.constants'

const cleanupExpiredRegistrations = onSchedule(
  {
    schedule: 'every 1 hours',
    region: REGION,
    memory: '256MiB',
    timeoutSeconds: 120,
  },
  async (): Promise<void> => {
    try {
      const db = admin.firestore()
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const oneHourAgoTimestamp = admin.firestore.Timestamp.fromDate(oneHourAgo)

      const expiredQuery = db
        .collection('pending_registrations')
        .where('createdAt', '<', oneHourAgoTimestamp)

      const snapshot = await expiredQuery.get()
      const expiredEmails = new Set<string>()

      if (!snapshot.empty) {
        const batch = db.batch()
        snapshot.docs.forEach((doc) => {
          expiredEmails.add(doc.id)
          batch.delete(doc.ref)
        })

        await batch.commit()
        console.info(`Deleted ${snapshot.size} expired pending registrations`)
      } else {
        console.info('No expired registrations found')
      }

      const mailQuery = db
        .collection('mail')
        .where('delivery.startTime', '<', oneHourAgoTimestamp)
        .limit(500)

      const mailSnapshot = await mailQuery.get()

      if (!mailSnapshot.empty) {
        const mailBatch = db.batch()
        mailSnapshot.docs.forEach((doc) => {
          mailBatch.delete(doc.ref)
        })

        await mailBatch.commit()
        console.info(`Deleted ${mailSnapshot.size} old mail documents`)
      }

      if (expiredEmails.size > 0) {
        const undeliveredBatch = db.batch()
        let undeliveredCount = 0

        for (const email of expiredEmails) {
          const mailQuery = db.collection('mail').where('to', '==', email)
          const mailSnapshot = await mailQuery.get()
          mailSnapshot.docs.forEach((doc) => {
            undeliveredBatch.delete(doc.ref)
            undeliveredCount++
          })
        }

        if (undeliveredCount > 0) {
          await undeliveredBatch.commit()
          console.info(
            `Deleted ${undeliveredCount} mail documents for expired registrations`,
          )
        }
      }
    } catch (error) {
      console.error('Error cleaning up expired registrations:', error)
      throw error
    }
  },
)

export { cleanupExpiredRegistrations }
