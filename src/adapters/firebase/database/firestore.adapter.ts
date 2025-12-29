import type { DatabasePort } from '@/core/ports/database'

const createFirestoreAdapter = (): DatabasePort => {
  throw new Error('FirestoreAdapter not implemented yet')
}

export { createFirestoreAdapter }
