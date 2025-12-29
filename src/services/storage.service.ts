import type { StoragePort } from '@/core/ports/storage'
import { createFirebaseStorageAdapter } from '@/adapters/firebase/storage'

let storageInstance: StoragePort | null = null

const getStorageService = (): StoragePort => {
  if (!storageInstance) {
    storageInstance = createFirebaseStorageAdapter()
  }
  return storageInstance
}

const resetStorageService = (): void => {
  storageInstance = null
}

export { getStorageService, resetStorageService }
