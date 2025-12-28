import type { AuthPort } from '@/core/ports/auth'

const createFirebaseAuthAdapter = (): AuthPort => {
  throw new Error('FirebaseAuthAdapter not implemented yet')
}

export { createFirebaseAuthAdapter }
