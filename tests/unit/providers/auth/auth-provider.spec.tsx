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

    it('should set up auth state listener on mount', () => {
      renderHook(() => useAuth(), { wrapper })

      expect(mockAuthService.onAuthStateChanged).toHaveBeenCalledTimes(1)
      expect(mockAuthService.onAuthStateChanged).toHaveBeenCalledWith(
        expect.any(Function),
      )
    })

    it('should start with loading state true and user null', () => {
      mockAuthService.onAuthStateChanged.mockReturnValue(() => {})

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should set user and stop loading when auth state changes', async () => {
      mockAuthService.onAuthStateChanged.mockImplementation((callback) => {
        callback(mockUser)
        return () => {}
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should set user to null when signed out', async () => {
      mockAuthService.onAuthStateChanged.mockImplementation((callback) => {
        callback(null)
        return () => {}
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should clean up auth listener on unmount', () => {
      const unsubscribeMock = jest.fn()
      mockAuthService.onAuthStateChanged.mockReturnValue(unsubscribeMock)

      const { unmount } = renderHook(() => useAuth(), { wrapper })

      unmount()

      expect(unsubscribeMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('signIn', () => {
    it('should call auth service signIn with credentials', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
      }

      mockAuthService.signIn.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.signIn(credentials)
      })

      expect(mockAuthService.signIn).toHaveBeenCalledWith(credentials)
      expect(result.current.error).toBeNull()
    })

    it('should handle signIn error and set error state', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
      }

      const mockError: AuthError = {
        code: 'auth/invalid-credential',
        message: 'Invalid credentials',
      }

      mockAuthService.signIn.mockRejectedValue(mockError)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await expect(result.current.signIn(credentials)).rejects.toEqual(
          mockError,
        )
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError)
      })
    })

    it('should clear error before signIn', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
      }

      const mockError: AuthError = {
        code: 'auth/invalid-credential',
        message: 'Invalid credentials',
      }

      mockAuthService.signIn.mockRejectedValueOnce(mockError)
      mockAuthService.signIn.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await expect(result.current.signIn(credentials)).rejects.toEqual(
          mockError,
        )
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError)
      })

      await act(async () => {
        await result.current.signIn(credentials)
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
      })
    })
  })

  describe('signUp', () => {
    it('should call auth service signUp with credentials', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
        displayName: randFullName(),
      }

      mockAuthService.signUp.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.signUp(credentials)
      })

      expect(mockAuthService.signUp).toHaveBeenCalledWith(credentials)
      expect(result.current.error).toBeNull()
    })

    it('should handle signUp error and set error state', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
        displayName: randFullName(),
      }

      const mockError: AuthError = {
        code: 'auth/email-already-in-use',
        message: 'Email already in use',
      }

      mockAuthService.signUp.mockRejectedValue(mockError)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await expect(result.current.signUp(credentials)).rejects.toEqual(
          mockError,
        )
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError)
      })
    })
  })

  describe('signInWithGoogle', () => {
    it('should call auth service signInWithGoogle', async () => {
      mockAuthService.signInWithGoogle.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.signInWithGoogle()
      })

      expect(mockAuthService.signInWithGoogle).toHaveBeenCalledTimes(1)
      expect(result.current.error).toBeNull()
    })

    it('should set loading state during signInWithGoogle', async () => {
      let resolveSignIn: () => void
      const signInPromise = new Promise<void>((resolve) => {
        resolveSignIn = resolve
      })

      mockAuthService.signInWithGoogle.mockReturnValue(signInPromise)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let signInPromiseResult: Promise<void>
      act(() => {
        signInPromiseResult = result.current.signInWithGoogle()
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      await act(async () => {
        resolveSignIn!()
        await signInPromiseResult!
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should handle signInWithGoogle error', async () => {
      const mockError: AuthError = {
        code: 'auth/popup-closed-by-user',
        message: 'Popup closed by user',
      }

      mockAuthService.signInWithGoogle.mockRejectedValue(mockError)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await expect(result.current.signInWithGoogle()).rejects.toEqual(
          mockError,
        )
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError)
      })
    })
  })

  describe('signOut', () => {
    it('should call auth service signOut', async () => {
      mockAuthService.signOut.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockAuthService.signOut).toHaveBeenCalledTimes(1)
      expect(result.current.error).toBeNull()
    })

    it('should handle signOut error', async () => {
      const mockError: AuthError = {
        code: 'auth/network-request-failed',
        message: 'Network request failed',
      }

      mockAuthService.signOut.mockRejectedValue(mockError)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await expect(result.current.signOut()).rejects.toEqual(mockError)
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError)
      })
    })

    it('should clear error before signOut', async () => {
      const mockError: AuthError = {
        code: 'auth/network-request-failed',
        message: 'Network request failed',
      }

      mockAuthService.signOut.mockRejectedValueOnce(mockError)
      mockAuthService.signOut.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await expect(result.current.signOut()).rejects.toEqual(mockError)
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError)
      })

      await act(async () => {
        await result.current.signOut()
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
      })
    })
  })
})
