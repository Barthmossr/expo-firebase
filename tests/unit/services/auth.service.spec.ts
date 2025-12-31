import { getAuthService, resetAuthService } from '@/services/auth.service'
import { createFirebaseAuthAdapter } from '@/adapters/firebase/auth'

jest.mock('@/adapters/firebase/auth')

const mockCreateAdapter = createFirebaseAuthAdapter as jest.MockedFunction<
  typeof createFirebaseAuthAdapter
>

describe('auth.service', () => {
  const mockAdapter = {
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
    signInWithGoogle: jest.fn(),
    getCurrentUser: jest.fn(),
    onAuthStateChanged: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    updateProfile: jest.fn(),
  }

  beforeEach(() => {
    resetAuthService()
    jest.clearAllMocks()
    mockCreateAdapter.mockReturnValue(mockAdapter)
  })

  describe('getAuthService', () => {
    it('should create adapter on first call', () => {
      const service = getAuthService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(service).toBe(mockAdapter)
    })

    it('should return same instance on subsequent calls', () => {
      const first = getAuthService()
      const second = getAuthService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(first).toBe(second)
    })
  })

  describe('resetAuthService', () => {
    it('should create new adapter after reset', () => {
      getAuthService()
      resetAuthService()
      getAuthService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(2)
    })
  })
})
