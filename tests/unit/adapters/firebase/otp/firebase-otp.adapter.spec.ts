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
  })
})
