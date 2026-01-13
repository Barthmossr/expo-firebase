const mockFunctionsInstance = {}

const mockGetFunctions = jest.fn(() => mockFunctionsInstance)
const mockHttpsCallableFromUrl = jest.fn(() => jest.fn())

export {
  mockGetFunctions as getFunctions,
  mockHttpsCallableFromUrl as httpsCallableFromUrl,
  mockFunctionsInstance,
}
