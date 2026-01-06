import { renderHook, waitFor } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { randEmail, randFullName, randPassword } from '@ngneat/falso'
import { AuthProvider } from '@/providers/auth'
import { getAuthService } from '@/services/auth'
import { getOTPService } from '@/services/otp'
import { initializeGoogleSignIn } from '@/config/auth'
import { useAuth } from '@/hooks/auth'
import type { AuthUser, AuthError } from '@/core/ports/auth'
import type { ReactNode } from 'react'

jest.mock('@/services/auth')
jest.mock('@/services/otp')
jest.mock('@/config/auth')

const mockGetAuthService = getAuthService as jest.MockedFunction<
  typeof getAuthService
>
const mockGetOTPService = getOTPService as jest.MockedFunction<
  typeof getOTPService
>
const mockInitializeGoogleSignIn =
  initializeGoogleSignIn as jest.MockedFunction<typeof initializeGoogleSignIn>

describe('AuthProvider', () => {
  const mockAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    createUserAfterVerification: jest.fn(),
    onAuthStateChanged: jest.fn(),
  }

  const mockOTPService = {
    sendVerificationCode: jest.fn(),
    verifyCode: jest.fn(),
    createUserAfterVerification: jest.fn(),
  }

  const mockUser: AuthUser = {
    id: 'user123',
    email: randEmail(),
    displayName: randFullName(),
    photoUrl: null,
    emailVerified: true,
  }

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  )

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAuthService.mockReturnValue(mockAuthService as never)
    mockGetOTPService.mockReturnValue(mockOTPService as never)
    mockInitializeGoogleSignIn.mockImplementation(() => {})
    mockAuthService.onAuthStateChanged.mockImplementation((callback) => {
      callback(null)
      return () => {}
    })
  })

  describe('initialization', () => {
    it('should initialize Google Sign In on mount', () => {
      renderHook(() => useAuth(), { wrapper })

      expect(mockInitializeGoogleSignIn).toHaveBeenCalledTimes(1)
    })
  })
})
