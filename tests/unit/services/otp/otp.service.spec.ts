import { getOTPService, resetOTPService } from '@/services/otp'
import { createFirebaseOTPAdapter } from '@/adapters/firebase/otp'

jest.mock('@/adapters/firebase/otp')

const mockCreateFirebaseOTPAdapter =
  createFirebaseOTPAdapter as jest.MockedFunction<
    typeof createFirebaseOTPAdapter
  >

describe('otp.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetOTPService()
  })

  describe('getOTPService', () => {
    it('should create adapter on first call', () => {
      const mockAdapter = {
        sendVerificationCode: jest.fn(),
        verifyCode: jest.fn(),
        resendCode: jest.fn(),
      }

      mockCreateFirebaseOTPAdapter.mockReturnValue(mockAdapter)

      const service = getOTPService()

      expect(mockCreateFirebaseOTPAdapter).toHaveBeenCalledTimes(1)
      expect(service).toBe(mockAdapter)
    })

    it('should return same instance on subsequent calls', () => {
      const mockAdapter = {
        sendVerificationCode: jest.fn(),
        verifyCode: jest.fn(),
        resendCode: jest.fn(),
      }

      mockCreateFirebaseOTPAdapter.mockReturnValue(mockAdapter)

      const service1 = getOTPService()
      const service2 = getOTPService()

      expect(mockCreateFirebaseOTPAdapter).toHaveBeenCalledTimes(1)
      expect(service1).toBe(service2)
    })
  })
})
