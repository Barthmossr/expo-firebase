import { createCloudFunctionsAdapter } from '@/adapters/firebase/functions'

describe('createCloudFunctionsAdapter', () => {
  it('should throw not implemented error', () => {
    expect(() => createCloudFunctionsAdapter()).toThrow(
      'CloudFunctionsAdapter not implemented yet',
    )
  })
})
