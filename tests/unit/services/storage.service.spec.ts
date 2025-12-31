import { getStorageService, resetStorageService } from '@/services/storage'
import { createFirebaseStorageAdapter } from '@/adapters/firebase/storage'

jest.mock('@/adapters/firebase/storage')

const mockCreateAdapter = createFirebaseStorageAdapter as jest.MockedFunction<
  typeof createFirebaseStorageAdapter
>

describe('storage.service', () => {
  const mockAdapter = {
    upload: jest.fn(),
    download: jest.fn(),
    delete: jest.fn(),
    getDownloadUrl: jest.fn(),
    listFiles: jest.fn(),
  }

  beforeEach(() => {
    resetStorageService()
    jest.clearAllMocks()
    mockCreateAdapter.mockReturnValue(mockAdapter)
  })

  describe('getStorageService', () => {
    it('should create adapter on first call', () => {
      const service = getStorageService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(service).toBe(mockAdapter)
    })

    it('should return same instance on subsequent calls', () => {
      const first = getStorageService()
      const second = getStorageService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(first).toBe(second)
    })
  })

  describe('resetStorageService', () => {
    it('should create new adapter after reset', () => {
      getStorageService()
      resetStorageService()
      getStorageService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(2)
    })
  })
})
