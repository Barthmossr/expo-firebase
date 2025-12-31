import type { AuthPort } from '@/core/ports/auth'
import { createFirebaseAuthAdapter } from '@/adapters/firebase/auth'

let authInstance: AuthPort | null = null

const getAuthService = (): AuthPort => {
  if (!authInstance) {
    authInstance = createFirebaseAuthAdapter()
  }
  return authInstance
}

const resetAuthService = (): void => {
  authInstance = null
}

export { getAuthService, resetAuthService }
