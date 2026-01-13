import { httpsCallableFromUrl } from '@react-native-firebase/functions'
import { mockFunctionsInstance } from '@mocks/@react-native-firebase/functions'
import {
  randEmail,
  randFullName,
  randNumber,
  randPassword,
} from '@ngneat/falso'
import { createFirebaseOTPAdapter } from '@/adapters/firebase/otp'
import { getFirebaseConfig } from '@/config/firebase'
import { createMockFirebaseConfig } from '../../../config/firebase/__mocks__/firebase.mocks'
import {
  createMockOTPVerificationResult,
  MOCK_TEST_PROJECT_ID,
  MOCK_TEST_REGION,
} from './__mocks__'

jest.mock('@react-native-firebase/functions')
jest.mock('@/config/firebase')

const mockGetFirebaseConfig = getFirebaseConfig as jest.MockedFunction<
  typeof getFirebaseConfig
>
const mockHttpsCallableFromUrl = httpsCallableFromUrl as jest.MockedFunction<
  typeof httpsCallableFromUrl
>

describe('createFirebaseOTPAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetFirebaseConfig.mockReturnValue(
      createMockFirebaseConfig({
        projectId: MOCK_TEST_PROJECT_ID,
        region: MOCK_TEST_REGION,
      }),
    )
  })

  describe('sendVerificationCode', () => {
    it('should call cloud function with correct data', async () => {
      const mockCallable = jest.fn().mockResolvedValue(undefined)
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable as never)

      const adapter = createFirebaseOTPAdapter()
      const email = randEmail()
      const displayName = randFullName()
      const password = randPassword()

      await adapter.sendVerificationCode({
        email,
        displayName,
        password,
      })

      expect(mockHttpsCallableFromUrl).toHaveBeenCalledWith(
        mockFunctionsInstance,
        `https://${MOCK_TEST_REGION}-${MOCK_TEST_PROJECT_ID}.cloudfunctions.net/sendOTPEmail`,
      )
      expect(mockCallable).toHaveBeenCalledWith({
        email,
        displayName,
        password,
      })
    })

    it('should use default region when not provided in config', async () => {
      mockGetFirebaseConfig.mockReturnValue(
        createMockFirebaseConfig({ projectId: MOCK_TEST_PROJECT_ID }),
      )

      const mockCallable = jest.fn().mockResolvedValue(undefined)
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable as never)

      const adapter = createFirebaseOTPAdapter()

      await adapter.sendVerificationCode({
        email: randEmail(),
        displayName: randFullName(),
        password: randPassword(),
      })

      expect(mockHttpsCallableFromUrl).toHaveBeenCalledWith(
        mockFunctionsInstance,
        `https://${MOCK_TEST_REGION}-${MOCK_TEST_PROJECT_ID}.cloudfunctions.net/sendOTPEmail`,
      )
    })

    it('should throw error when cloud function fails', async () => {
      const mockCallable = jest
        .fn()
        .mockRejectedValue(new Error('Function failed'))
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable as never)

      const adapter = createFirebaseOTPAdapter()

      await expect(
        adapter.sendVerificationCode({
          email: randEmail(),
          displayName: randFullName(),
          password: randPassword(),
        }),
      ).rejects.toThrow('Function failed')
    })
  })

  describe('verifyCode', () => {
    it('should call cloud function with email and code', async () => {
      const email = randEmail()
      const code = randNumber({ min: 100000, max: 999999 }).toString()
      const verificationResult = createMockOTPVerificationResult({
        email,
        password: randPassword(),
        displayName: randFullName(),
      })

      const mockCallable = jest
        .fn()
        .mockResolvedValue({ data: verificationResult })
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable as never)

      const adapter = createFirebaseOTPAdapter()
      const result = await adapter.verifyCode({ email, code })

      expect(mockHttpsCallableFromUrl).toHaveBeenCalledWith(
        mockFunctionsInstance,
        `https://${MOCK_TEST_REGION}-${MOCK_TEST_PROJECT_ID}.cloudfunctions.net/verifyOTPEmail`,
      )
      expect(mockCallable).toHaveBeenCalledWith({ email, code })
      expect(result).toEqual(verificationResult)
    })

    it('should return verification result data', async () => {
      const verificationResult = createMockOTPVerificationResult({
        email: randEmail(),
        password: randPassword(),
        displayName: randFullName(),
      })

      const mockCallable = jest
        .fn()
        .mockResolvedValue({ data: verificationResult })
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable as never)

      const adapter = createFirebaseOTPAdapter()
      const result = await adapter.verifyCode({
        email: randEmail(),
        code: randNumber({ min: 100000, max: 999999 }).toString(),
      })

      expect(result).toEqual(verificationResult)
      expect(result.success).toBe(true)
    })

    it('should throw error when verification fails', async () => {
      const mockCallable = jest
        .fn()
        .mockRejectedValue(new Error('Invalid code'))
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable as never)

      const adapter = createFirebaseOTPAdapter()

      await expect(
        adapter.verifyCode({
          email: randEmail(),
          code: randNumber({ min: 100000, max: 999999 }).toString(),
        }),
      ).rejects.toThrow('Invalid code')
    })
  })

  describe('resendCode', () => {
    it('should call cloud function with email and resend flag', async () => {
      const mockCallable = jest.fn().mockResolvedValue(undefined)
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable as never)

      const adapter = createFirebaseOTPAdapter()
      const email = randEmail()

      await adapter.resendCode({ email })

      expect(mockHttpsCallableFromUrl).toHaveBeenCalledWith(
        mockFunctionsInstance,
        `https://${MOCK_TEST_REGION}-${MOCK_TEST_PROJECT_ID}.cloudfunctions.net/sendOTPEmail`,
      )
      expect(mockCallable).toHaveBeenCalledWith({ email, resend: true })
    })

    it('should throw error when resend fails', async () => {
      const mockCallable = jest
        .fn()
        .mockRejectedValue(new Error('Resend failed'))
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable as never)

      const adapter = createFirebaseOTPAdapter()

      await expect(adapter.resendCode({ email: randEmail() })).rejects.toThrow(
        'Resend failed',
      )
    })
  })
})
