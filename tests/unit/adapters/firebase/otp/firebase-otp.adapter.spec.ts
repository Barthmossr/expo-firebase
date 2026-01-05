import functions from '@react-native-firebase/functions'
import { randEmail, randFullName, randPassword } from '@ngneat/falso'
import { createFirebaseOTPAdapter } from '@/adapters/firebase/otp'
import { getFirebaseConfig } from '@/config/firebase'
import { createMockFirebaseConfig } from '../../../config/firebase/__mocks__/firebase.mocks'
import { createMockOTPVerificationResult } from './__mocks__/otp.mocks'

jest.mock('@react-native-firebase/functions', () => {
  return jest.fn()
})
jest.mock('@/config/firebase')

const mockGetFirebaseConfig = getFirebaseConfig as jest.MockedFunction<
  typeof getFirebaseConfig
>
const mockFunctions = functions as jest.MockedFunction<typeof functions>

describe('createFirebaseOTPAdapter', () => {
  const mockHttpsCallableFromUrl = jest.fn()
  const testProjectId = 'test-project'

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetFirebaseConfig.mockReturnValue(
      createMockFirebaseConfig({
        projectId: testProjectId,
        region: 'southamerica-east1',
      }),
    )

    mockFunctions.mockReturnValue({
      httpsCallableFromUrl: mockHttpsCallableFromUrl,
    } as Partial<ReturnType<typeof functions>> as ReturnType<typeof functions>)
  })

  describe('sendVerificationCode', () => {
    it('should call cloud function with correct data', async () => {
      const mockCallable = jest.fn().mockResolvedValue(undefined)
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable)

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
        `https://southamerica-east1-${testProjectId}.cloudfunctions.net/sendOTPEmail`,
      )
      expect(mockCallable).toHaveBeenCalledWith({
        email,
        displayName,
        password,
      })
    })

    it('should use default region when not provided in config', async () => {
      mockGetFirebaseConfig.mockReturnValue(
        createMockFirebaseConfig({ projectId: testProjectId }),
      )

      const mockCallable = jest.fn().mockResolvedValue(undefined)
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable)

      const adapter = createFirebaseOTPAdapter()

      await adapter.sendVerificationCode({
        email: randEmail(),
        displayName: randFullName(),
        password: randPassword(),
      })

      expect(mockHttpsCallableFromUrl).toHaveBeenCalledWith(
        `https://southamerica-east1-${testProjectId}.cloudfunctions.net/sendOTPEmail`,
      )
    })

    it('should throw error when cloud function fails', async () => {
      const mockCallable = jest
        .fn()
        .mockRejectedValue(new Error('Function failed'))
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable)

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
      const code = '123456'
      const verificationResult = createMockOTPVerificationResult({
        email,
        password: randPassword(),
        displayName: randFullName(),
      })

      const mockCallable = jest
        .fn()
        .mockResolvedValue({ data: verificationResult })
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable)

      const adapter = createFirebaseOTPAdapter()
      const result = await adapter.verifyCode({ email, code })

      expect(mockHttpsCallableFromUrl).toHaveBeenCalledWith(
        `https://southamerica-east1-${testProjectId}.cloudfunctions.net/verifyOTPEmail`,
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
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable)

      const adapter = createFirebaseOTPAdapter()
      const result = await adapter.verifyCode({
        email: randEmail(),
        code: '123456',
      })

      expect(result).toEqual(verificationResult)
      expect(result.success).toBe(true)
    })

    it('should throw error when verification fails', async () => {
      const mockCallable = jest
        .fn()
        .mockRejectedValue(new Error('Invalid code'))
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable)

      const adapter = createFirebaseOTPAdapter()

      await expect(
        adapter.verifyCode({ email: randEmail(), code: '123456' }),
      ).rejects.toThrow('Invalid code')
    })
  })

  describe('resendCode', () => {
    it('should call cloud function with email and resend flag', async () => {
      const mockCallable = jest.fn().mockResolvedValue(undefined)
      mockHttpsCallableFromUrl.mockReturnValue(mockCallable)

      const adapter = createFirebaseOTPAdapter()
      const email = randEmail()

      await adapter.resendCode({ email })

      expect(mockHttpsCallableFromUrl).toHaveBeenCalledWith(
        `https://southamerica-east1-${testProjectId}.cloudfunctions.net/sendOTPEmail`,
      )
      expect(mockCallable).toHaveBeenCalledWith({ email, resend: true })
    })
  })
})
