import type { DatabasePort } from '@/core/ports/database'
import { createFirestoreAdapter } from '@/adapters/firebase/database'

let databaseInstance: DatabasePort | null = null

const getDatabaseService = (): DatabasePort => {
  if (!databaseInstance) {
    databaseInstance = createFirestoreAdapter()
  }
  return databaseInstance
}

const resetDatabaseService = (): void => {
  databaseInstance = null
}

export { getDatabaseService, resetDatabaseService }
