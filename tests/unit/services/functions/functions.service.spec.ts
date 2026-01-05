import {
  getFunctionsService,
  resetFunctionsService,
} from '@/services/functions'
import { createCloudFunctionsAdapter } from '@/adapters/firebase/functions'

jest.mock('@/adapters/firebase/functions')

const mockCreateAdapter = createCloudFunctionsAdapter as jest.MockedFunction<
  typeof createCloudFunctionsAdapter
>

describe('functions.service', () => {
  const mockAdapter = {
    call: jest.fn(),
  }

  beforeEach(() => {
    resetFunctionsService()
    jest.clearAllMocks()
    mockCreateAdapter.mockReturnValue(mockAdapter)
  })

  describe('getFunctionsService', () => {
    it('should create adapter on first call', () => {
      const service = getFunctionsService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(service).toBe(mockAdapter)
    })

    it('should return same instance on subsequent calls', () => {
      const first = getFunctionsService()
      const second = getFunctionsService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(first).toBe(second)
    })
  })

  describe('resetFunctionsService', () => {
    it('should create new adapter after reset', () => {
      getFunctionsService()
      resetFunctionsService()
      getFunctionsService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(2)
    })
  })
})
