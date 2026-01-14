import { createDevelopmentLoggerAdapter } from '@/adapters/logger'

describe('createDevelopmentLoggerAdapter', () => {
  const originalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  }

  beforeEach(() => {
    console.debug = jest.fn()
    console.info = jest.fn()
    console.warn = jest.fn()
    console.error = jest.fn()
  })

  afterEach(() => {
    console.debug = originalConsole.debug
    console.info = originalConsole.info
    console.warn = originalConsole.warn
    console.error = originalConsole.error
  })

  it('should create adapter with all methods', () => {
    const adapter = createDevelopmentLoggerAdapter()

    expect(adapter.debug).toBeDefined()
    expect(adapter.info).toBeDefined()
    expect(adapter.warn).toBeDefined()
    expect(adapter.error).toBeDefined()
  })
})
