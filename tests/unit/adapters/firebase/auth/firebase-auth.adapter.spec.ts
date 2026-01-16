import {
  randEmail,
  randFullName,
  randPassword,
  randUrl,
  randUuid,
} from '@ngneat/falso'
import { createFirebaseAuthAdapter } from '@/adapters/firebase/auth'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
} from '@react-native-firebase/auth'
import { mockAuthInstance } from '@mocks/@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import type { AuthPort } from '@/core/ports/auth'

jest.mock('@react-native-google-signin/google-signin')
jest.mock('expo-constants', () => ({
  expoConfig: {
    ios: { bundleIdentifier: 'com.test.app' },
    android: { package: 'com.test.app' },
    extra: { firebase: { projectId: 'test-project' } },
  },
}))

const mockSignInWithEmailAndPassword =
  signInWithEmailAndPassword as jest.MockedFunction<
    typeof signInWithEmailAndPassword
  >
const mockCreateUserWithEmailAndPassword =
  createUserWithEmailAndPassword as jest.MockedFunction<
    typeof createUserWithEmailAndPassword
  >
const mockSignInWithCredential = signInWithCredential as jest.MockedFunction<
  typeof signInWithCredential
>
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>
const mockSendPasswordResetEmail =
  sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>
const mockConfirmPasswordReset = confirmPasswordReset as jest.MockedFunction<
  typeof confirmPasswordReset
>
const mockVerifyPasswordResetCode =
  verifyPasswordResetCode as jest.MockedFunction<typeof verifyPasswordResetCode>
const mockFetchSignInMethodsForEmail =
  fetchSignInMethodsForEmail as jest.MockedFunction<
    typeof fetchSignInMethodsForEmail
  >
const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<
  typeof onAuthStateChanged
>
const mockUpdateProfile = updateProfile as jest.MockedFunction<
  typeof updateProfile
>
const mockGoogleAuthProvider = GoogleAuthProvider as jest.Mocked<
  typeof GoogleAuthProvider
>
const mockGoogleSignin = GoogleSignin as jest.Mocked<typeof GoogleSignin>

describe('createFirebaseAuthAdapter', () => {
  let adapter: AuthPort

  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthInstance.currentUser = null
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
    expect(typeof adapter.confirmPasswordReset).toBe('function')
    expect(typeof adapter.verifyPasswordResetCode).toBe('function')
    expect(typeof adapter.updateProfile).toBe('function')
    expect(typeof adapter.fetchSignInMethodsForEmail).toBe('function')
    expect(typeof adapter.createUserAfterVerification).toBe('function')
  })

  describe('getCurrentUser', () => {
    it('should return null when no user is signed in', () => {
      mockAuthInstance.currentUser = null

      const user = adapter.getCurrentUser()

      expect(user).toBeNull()
    })

    it('should return user when signed in', () => {
      const mockUser = {
        uid: randUuid(),
        email: randEmail(),
        displayName: randFullName(),
        photoURL: null,
        emailVerified: true,
      }

      mockAuthInstance.currentUser = mockUser as never

      const user = adapter.getCurrentUser()

      expect(user).toEqual({
        id: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoUrl: mockUser.photoURL,
        emailVerified: mockUser.emailVerified,
      })
    })
  })

  describe('signIn', () => {
    it('should sign in with email and password', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
      }

      const mockUser = {
        uid: randUuid(),
        email: credentials.email,
        displayName: randFullName(),
        photoURL: null,
        emailVerified: true,
      }

      mockSignInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      } as never)

      const user = await adapter.signIn(credentials)

      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuthInstance,
        credentials.email,
        credentials.password,
      )
      expect(user).toEqual({
        id: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoUrl: mockUser.photoURL,
        emailVerified: mockUser.emailVerified,
      })
    })

    it('should throw error when user is null', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
      }

      mockSignInWithEmailAndPassword.mockResolvedValue({
        user: null,
      } as never)

      await expect(adapter.signIn(credentials)).rejects.toMatchObject({
        code: 'auth/unknown',
      })
    })

    it('should handle authentication errors', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
      }

      mockSignInWithEmailAndPassword.mockRejectedValue({
        code: 'auth/invalid-credential',
      })

      await expect(adapter.signIn(credentials)).rejects.toMatchObject({
        code: 'auth/invalid-credential',
      })
    })
  })

  describe('signUp', () => {
    it('should create user with email, password, and display name', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
        displayName: randFullName(),
      }

      const mockUser = {
        uid: randUuid(),
        email: credentials.email,
        displayName: null,
        photoURL: null,
        emailVerified: false,
      }

      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      } as never)
      mockUpdateProfile.mockResolvedValue(undefined as never)

      const user = await adapter.signUp(credentials)

      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuthInstance,
        credentials.email,
        credentials.password,
      )
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: credentials.displayName,
      })
      expect(user).toEqual({
        id: mockUser.uid,
        email: mockUser.email,
        displayName: credentials.displayName,
        photoUrl: mockUser.photoURL,
        emailVerified: mockUser.emailVerified,
      })
    })

    it('should throw error when user is null', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
        displayName: randFullName(),
      }

      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: null,
      } as never)

      await expect(adapter.signUp(credentials)).rejects.toMatchObject({
        code: 'auth/unknown',
      })
    })

    it('should handle email-already-in-use error', async () => {
      const credentials = {
        email: randEmail(),
        password: randPassword(),
        displayName: randFullName(),
      }

      mockCreateUserWithEmailAndPassword.mockRejectedValue({
        code: 'auth/email-already-in-use',
      })

      await expect(adapter.signUp(credentials)).rejects.toMatchObject({
        code: 'auth/email-already-in-use',
      })
    })
  })

  describe('signInWithGoogle', () => {
    it('should sign in with Google successfully', async () => {
      const mockIdToken = 'mock-id-token'
      const mockCredential = { token: 'mock-credential' }

      const mockUser = {
        uid: randUuid(),
        email: randEmail(),
        displayName: randFullName(),
        photoURL: randUrl(),
        emailVerified: true,
      }

      mockGoogleSignin.hasPlayServices.mockResolvedValue(true)
      mockGoogleSignin.signIn.mockResolvedValue({
        data: { idToken: mockIdToken },
      } as never)
      mockGoogleAuthProvider.credential.mockReturnValue(mockCredential as never)
      mockSignInWithCredential.mockResolvedValue({
        user: mockUser,
      } as never)

      const user = await adapter.signInWithGoogle()

      expect(mockGoogleSignin.hasPlayServices).toHaveBeenCalledWith({
        showPlayServicesUpdateDialog: true,
      })
      expect(mockGoogleSignin.signIn).toHaveBeenCalled()
      expect(mockGoogleAuthProvider.credential).toHaveBeenCalledWith(
        mockIdToken,
      )
      expect(mockSignInWithCredential).toHaveBeenCalledWith(
        mockAuthInstance,
        mockCredential,
      )
      expect(user).toEqual({
        id: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoUrl: mockUser.photoURL,
        emailVerified: mockUser.emailVerified,
      })
    })

    it('should throw error when Google Sign-In is cancelled', async () => {
      mockGoogleSignin.hasPlayServices.mockResolvedValue(true)
      mockGoogleSignin.signIn.mockResolvedValue({
        data: null,
      } as never)

      await expect(adapter.signInWithGoogle()).rejects.toMatchObject({
        code: 'auth/popup-closed-by-user',
      })
    })

    it('should throw error when no idToken is returned', async () => {
      mockGoogleSignin.hasPlayServices.mockResolvedValue(true)
      mockGoogleSignin.signIn.mockResolvedValue({
        data: { idToken: null },
      } as never)

      await expect(adapter.signInWithGoogle()).rejects.toMatchObject({
        code: 'auth/popup-closed-by-user',
      })
    })

    it('should throw error when user is null after sign in', async () => {
      const mockIdToken = 'mock-id-token'
      const mockCredential = { token: 'mock-credential' }

      mockGoogleSignin.hasPlayServices.mockResolvedValue(true)
      mockGoogleSignin.signIn.mockResolvedValue({
        data: { idToken: mockIdToken },
      } as never)
      mockGoogleAuthProvider.credential.mockReturnValue(mockCredential as never)
      mockSignInWithCredential.mockResolvedValue({
        user: null,
      } as never)

      await expect(adapter.signInWithGoogle()).rejects.toMatchObject({
        code: 'auth/unknown',
      })
    })

    it('should handle Google Sign-In errors', async () => {
      mockGoogleSignin.hasPlayServices.mockRejectedValue(
        new Error('Play Services not available'),
      )

      await expect(adapter.signInWithGoogle()).rejects.toMatchObject({
        code: 'auth/unknown',
      })
    })
  })

  describe('signOut', () => {
    it('should sign out from Firebase and Google when Google user exists', async () => {
      mockGoogleSignin.getCurrentUser.mockResolvedValue({} as never)
      mockGoogleSignin.signOut.mockResolvedValue(null as never)
      mockSignOut.mockResolvedValue(undefined as never)

      await adapter.signOut()

      expect(mockGoogleSignin.getCurrentUser).toHaveBeenCalled()
      expect(mockGoogleSignin.signOut).toHaveBeenCalled()
      expect(mockSignOut).toHaveBeenCalledWith(mockAuthInstance)
    })

    it('should sign out from Firebase only when no Google user', async () => {
      mockGoogleSignin.getCurrentUser.mockResolvedValue(null as never)
      mockSignOut.mockResolvedValue(undefined as never)

      await adapter.signOut()

      expect(mockGoogleSignin.getCurrentUser).toHaveBeenCalled()
      expect(mockGoogleSignin.signOut).not.toHaveBeenCalled()
      expect(mockSignOut).toHaveBeenCalledWith(mockAuthInstance)
    })

    it('should handle sign out errors', async () => {
      mockGoogleSignin.getCurrentUser.mockResolvedValue(null as never)
      mockSignOut.mockRejectedValue({
        code: 'auth/network-request-failed',
      })

      await expect(adapter.signOut()).rejects.toMatchObject({
        code: 'auth/network-request-failed',
      })
    })
  })

  describe('onAuthStateChanged', () => {
    it('should call callback when auth state changes', () => {
      const callback = jest.fn()
      const mockUser = {
        uid: randUuid(),
        email: randEmail(),
        displayName: randFullName(),
        photoURL: null,
        emailVerified: true,
      }

      mockOnAuthStateChanged.mockImplementation((_auth, cb) => {
        ;(cb as (user: unknown) => void)(mockUser)
        return (): void => {}
      })

      adapter.onAuthStateChanged(callback)

      expect(mockOnAuthStateChanged).toHaveBeenCalledWith(
        mockAuthInstance,
        expect.any(Function),
      )
      expect(callback).toHaveBeenCalledWith({
        id: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoUrl: mockUser.photoURL,
        emailVerified: mockUser.emailVerified,
      })
    })

    it('should call callback with null when user signs out', () => {
      const callback = jest.fn()

      mockOnAuthStateChanged.mockImplementation((_auth, cb) => {
        ;(cb as (user: unknown) => void)(null)
        return (): void => {}
      })

      adapter.onAuthStateChanged(callback)

      expect(callback).toHaveBeenCalledWith(null)
    })

    it('should return unsubscribe function', () => {
      const callback = jest.fn()
      const unsubscribe = jest.fn()

      mockOnAuthStateChanged.mockReturnValue(unsubscribe as never)

      const result = adapter.onAuthStateChanged(callback)

      expect(result).toBe(unsubscribe)
    })
  })

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email', async () => {
      const email = randEmail()
      mockSendPasswordResetEmail.mockResolvedValue(undefined as never)

      await adapter.sendPasswordResetEmail(email)

      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
        mockAuthInstance,
        email,
        expect.objectContaining({
          handleCodeInApp: true,
          iOS: expect.any(Object),
          android: expect.any(Object),
        }),
      )
    })

    it('should handle user-not-found error', async () => {
      const email = randEmail()
      mockSendPasswordResetEmail.mockRejectedValue({
        code: 'auth/user-not-found',
      })

      await expect(adapter.sendPasswordResetEmail(email)).rejects.toMatchObject(
        {
          code: 'auth/user-not-found',
        },
      )
    })
  })

  describe('confirmPasswordReset', () => {
    it('should confirm password reset with code and new password', async () => {
      const code = randUuid()
      const newPassword = randPassword()

      mockConfirmPasswordReset.mockResolvedValue(undefined as never)

      await adapter.confirmPasswordReset(code, newPassword)

      expect(mockConfirmPasswordReset).toHaveBeenCalledWith(
        mockAuthInstance,
        code,
        newPassword,
      )
    })

    it('should handle invalid code error', async () => {
      const code = 'invalid-code'
      const newPassword = randPassword()

      mockConfirmPasswordReset.mockRejectedValue({
        code: 'auth/invalid-action-code',
      })

      await expect(
        adapter.confirmPasswordReset(code, newPassword),
      ).rejects.toMatchObject({
        code: 'auth/invalid-action-code',
      })
    })

    it('should handle expired code error', async () => {
      const code = 'expired-code'
      const newPassword = randPassword()

      mockConfirmPasswordReset.mockRejectedValue({
        code: 'auth/expired-action-code',
      })

      await expect(
        adapter.confirmPasswordReset(code, newPassword),
      ).rejects.toMatchObject({
        code: 'auth/expired-action-code',
      })
    })
  })

  describe('verifyPasswordResetCode', () => {
    it('should verify password reset code and return email', async () => {
      const code = randUuid()
      const email = randEmail()

      mockVerifyPasswordResetCode.mockResolvedValue(email as never)

      const result = await adapter.verifyPasswordResetCode(code)

      expect(result).toBe(email)
      expect(mockVerifyPasswordResetCode).toHaveBeenCalledWith(
        mockAuthInstance,
        code,
      )
    })

    it('should handle invalid code error', async () => {
      const code = 'invalid-code'

      mockVerifyPasswordResetCode.mockRejectedValue({
        code: 'auth/invalid-action-code',
      })

      await expect(adapter.verifyPasswordResetCode(code)).rejects.toMatchObject(
        {
          code: 'auth/invalid-action-code',
        },
      )
    })

    it('should handle expired code error', async () => {
      const code = 'expired-code'

      mockVerifyPasswordResetCode.mockRejectedValue({
        code: 'auth/expired-action-code',
      })

      await expect(adapter.verifyPasswordResetCode(code)).rejects.toMatchObject(
        {
          code: 'auth/expired-action-code',
        },
      )
    })
  })

  describe('fetchSignInMethodsForEmail', () => {
    it('should fetch sign-in methods for email', async () => {
      const email = randEmail()
      mockFetchSignInMethodsForEmail.mockResolvedValue(['password'] as never)

      const result = await adapter.fetchSignInMethodsForEmail(email)

      expect(mockFetchSignInMethodsForEmail).toHaveBeenCalledWith(
        mockAuthInstance,
        email,
      )
      expect(result).toEqual({
        methods: ['password'],
        hasPassword: true,
        hasOAuth: false,
      })
    })

    it('should detect OAuth provider', async () => {
      const email = randEmail()
      mockFetchSignInMethodsForEmail.mockResolvedValue(['google.com'] as never)

      const result = await adapter.fetchSignInMethodsForEmail(email)

      expect(result).toEqual({
        methods: ['google.com'],
        hasPassword: false,
        hasOAuth: true,
      })
    })

    it('should detect both password and OAuth', async () => {
      const email = randEmail()
      mockFetchSignInMethodsForEmail.mockResolvedValue([
        'password',
        'google.com',
      ] as never)

      const result = await adapter.fetchSignInMethodsForEmail(email)

      expect(result).toEqual({
        methods: ['password', 'google.com'],
        hasPassword: true,
        hasOAuth: true,
      })
    })

    it('should return empty methods for non-existent user', async () => {
      const email = randEmail()
      mockFetchSignInMethodsForEmail.mockResolvedValue([] as never)

      const result = await adapter.fetchSignInMethodsForEmail(email)

      expect(result).toEqual({
        methods: [],
        hasPassword: false,
        hasOAuth: false,
      })
    })

    it('should return empty result on fetch error', async () => {
      const email = randEmail()
      mockFetchSignInMethodsForEmail.mockRejectedValue({
        code: 'auth/invalid-email',
      })

      const result = await adapter.fetchSignInMethodsForEmail(email)

      expect(result).toEqual({
        methods: [],
        hasPassword: false,
        hasOAuth: false,
      })
    })
  })

  describe('updateProfile', () => {
    it('should update display name', async () => {
      const displayName = randFullName()
      const mockUser = {
        uid: randUuid(),
        email: randEmail(),
        displayName: null,
        photoURL: null,
        emailVerified: true,
      }

      mockAuthInstance.currentUser = mockUser as never
      mockUpdateProfile.mockResolvedValue(undefined as never)

      await adapter.updateProfile({ displayName })

      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, {
        displayName,
        photoURL: undefined,
      })
    })

    it('should update photo URL', async () => {
      const photoUrl = randUrl()
      const mockUser = {
        uid: randUuid(),
        email: randEmail(),
        displayName: randFullName(),
        photoURL: null,
        emailVerified: true,
      }

      mockAuthInstance.currentUser = mockUser as never
      mockUpdateProfile.mockResolvedValue(undefined as never)

      await adapter.updateProfile({ photoUrl })

      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: undefined,
        photoURL: photoUrl,
      })
    })

    it('should update both display name and photo URL', async () => {
      const displayName = randFullName()
      const photoUrl = randUrl()
      const mockUser = {
        uid: randUuid(),
        email: randEmail(),
        displayName: null,
        photoURL: null,
        emailVerified: true,
      }

      mockAuthInstance.currentUser = mockUser as never
      mockUpdateProfile.mockResolvedValue(undefined as never)

      await adapter.updateProfile({ displayName, photoUrl })

      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, {
        displayName,
        photoURL: photoUrl,
      })
    })

    it('should throw error when no user is signed in', async () => {
      mockAuthInstance.currentUser = null

      await expect(
        adapter.updateProfile({ displayName: randFullName() }),
      ).rejects.toMatchObject({
        code: 'auth/user-not-found',
      })
    })
  })

  describe('createUserAfterVerification', () => {
    it('should create user with verified email', async () => {
      const email = randEmail()
      const password = randPassword()
      const displayName = randFullName()

      const mockUser = {
        uid: randUuid(),
        email,
        displayName: null,
        photoURL: null,
        emailVerified: false,
      }

      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      } as never)
      mockUpdateProfile.mockResolvedValue(undefined as never)

      const user = await adapter.createUserAfterVerification(
        email,
        password,
        displayName,
      )

      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuthInstance,
        email,
        password,
      )
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { displayName })
      expect(user).toEqual({
        id: mockUser.uid,
        email: mockUser.email,
        displayName,
        photoUrl: mockUser.photoURL,
        emailVerified: mockUser.emailVerified,
      })
    })

    it('should throw error when user is null', async () => {
      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: null,
      } as never)

      await expect(
        adapter.createUserAfterVerification(
          randEmail(),
          randPassword(),
          randFullName(),
        ),
      ).rejects.toMatchObject({
        code: 'auth/unknown',
      })
    })

    it('should handle errors during user creation', async () => {
      mockCreateUserWithEmailAndPassword.mockRejectedValue({
        code: 'auth/email-already-in-use',
      })

      await expect(
        adapter.createUserAfterVerification(
          randEmail(),
          randPassword(),
          randFullName(),
        ),
      ).rejects.toMatchObject({
        code: 'auth/email-already-in-use',
      })
    })
  })
})
