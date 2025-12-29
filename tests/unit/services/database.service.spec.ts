import {
  getDatabaseService,
  resetDatabaseService,
} from '@/services/database.service'
import { createFirestoreAdapter } from '@/adapters/firebase/database'

jest.mock('@/adapters/firebase/database')

const mockCreateAdapter = createFirestoreAdapter as jest.MockedFunction<
  typeof createFirestoreAdapter
>

describe('database.service', () => {
  const mockAdapter = {
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: jest.fn(),
    list: jest.fn(),
    create: jest.fn(),
    onSnapshot: jest.fn(),
    onCollectionSnapshot: jest.fn(),
  }

  beforeEach(() => {
    resetDatabaseService()
    jest.clearAllMocks()
    mockCreateAdapter.mockReturnValue(mockAdapter)
  })

  describe('getDatabaseService', () => {
    it('should create adapter on first call', () => {
      const service = getDatabaseService()

      expect(mockCreateAdapter).toHaveBeenCalledTimes(1)
      expect(service).toBe(mockAdapter)
    })
  })
})
