export const GoogleSignin = {
  configure: jest.fn(),
  hasPlayServices: jest.fn().mockResolvedValue(true),
  signIn: jest.fn().mockResolvedValue({ data: { idToken: 'mock-id-token' } }),
  signOut: jest.fn().mockResolvedValue(null),
  getCurrentUser: jest.fn().mockResolvedValue(null),
  getTokens: jest.fn().mockResolvedValue({ idToken: 'mock-id-token' }),
}

export default { GoogleSignin }
