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

  describe('debug', () => {
    it('should call console.debug with formatted message', () => {
      const adapter = createDevelopmentLoggerAdapter()

      adapter.debug('test message')

      expect(console.debug).toHaveBeenCalledWith('[DEBUG] test message')
    })

    it('should include context in message', () => {
      const adapter = createDevelopmentLoggerAdapter()

      adapter.debug('test message', { userId: '123' })

      expect(console.debug).toHaveBeenCalledWith(
        '[DEBUG] test message {"userId":"123"}',
      )
    })
  })

  describe('info', () => {
    it('should call console.info with formatted message', () => {
      const adapter = createDevelopmentLoggerAdapter()

      adapter.info('test message')

      expect(console.info).toHaveBeenCalledWith('[INFO] test message')
    })

    it('should include context in message', () => {
      const adapter = createDevelopmentLoggerAdapter()

      adapter.info('test message', { screen: 'home' })

      expect(console.info).toHaveBeenCalledWith(
        '[INFO] test message {"screen":"home"}',
      )
    })
  })

  describe('warn', () => {
    it('should call console.warn with formatted message', () => {
      const adapter = createDevelopmentLoggerAdapter()

      adapter.warn('test message')

      expect(console.warn).toHaveBeenCalledWith('[WARN] test message')
    })
  })
})
