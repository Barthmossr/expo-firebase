import { createFirebaseAuthAdapter } from '@/adapters/firebase/auth'

describe('createFirebaseAuthAdapter', () => {
  it('should throw not implemented error', () => {
    expect(() => createFirebaseAuthAdapter()).toThrow(
      'FirebaseAuthAdapter not implemented yet',
    )
  })
})
