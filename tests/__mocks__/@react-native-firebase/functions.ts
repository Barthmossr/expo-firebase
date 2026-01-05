const mockHttpsCallable = jest.fn(() => jest.fn())

const mockFunctionsModule = (): { httpsCallable: jest.Mock } => ({
  httpsCallable: mockHttpsCallable,
})

export default mockFunctionsModule
export { mockHttpsCallable }
