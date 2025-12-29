import { createFirestoreAdapter } from '@/adapters/firebase/database'

describe('createFirestoreAdapter', () => {
  it('should throw not implemented error', () => {
    expect(() => createFirestoreAdapter()).toThrow(
      'FirestoreAdapter not implemented yet',
    )
  })
})
