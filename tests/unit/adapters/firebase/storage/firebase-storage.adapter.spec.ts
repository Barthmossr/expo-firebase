import { createFirebaseStorageAdapter } from '@/adapters/firebase/storage'

describe('createFirebaseStorageAdapter', () => {
  it('should throw not implemented error', () => {
    expect(() => createFirebaseStorageAdapter()).toThrow(
      'FirebaseStorageAdapter not implemented yet',
    )
  })
})
