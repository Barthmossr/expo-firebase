import { randUuid, randNumber } from '@ngneat/falso'
import type { FirebaseConfig } from '@/config/firebase'

const createMockFirebaseConfig = (
  overrides?: Partial<FirebaseConfig>,
): FirebaseConfig => {
  const projectId = randUuid()
  return {
    apiKey: randUuid(),
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: randNumber({
      min: 100000000,
      max: 999999999,
    }).toString(),
    appId: `1:${randNumber({ min: 100000000, max: 999999999 })}:web:${randUuid()}`,
    ...overrides,
  }
}

export { createMockFirebaseConfig }
