import { createFirebaseAuthAdapter } from '@/adapters/firebase/auth'
import type { AuthPort } from '@/core/ports/auth'

describe('createFirebaseAuthAdapter', () => {
  let adapter: AuthPort

  beforeEach(() => {
    adapter = createFirebaseAuthAdapter()
  })

  it('should create adapter with all required methods', () => {
    expect(adapter).toBeDefined()
    expect(typeof adapter.signIn).toBe('function')
    expect(typeof adapter.signUp).toBe('function')
    expect(typeof adapter.signInWithGoogle).toBe('function')
    expect(typeof adapter.signOut).toBe('function')
    expect(typeof adapter.getCurrentUser).toBe('function')
    expect(typeof adapter.onAuthStateChanged).toBe('function')
    expect(typeof adapter.sendPasswordResetEmail).toBe('function')
    expect(typeof adapter.updateProfile).toBe('function')
  })

  it('should return null when no user is signed in', () => {
    const user = adapter.getCurrentUser()

    expect(user).toBeNull()
  })
})
