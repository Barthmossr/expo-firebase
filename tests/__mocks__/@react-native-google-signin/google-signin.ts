import { randUuid } from '@ngneat/falso'

export const GoogleSignin = {
  configure: jest.fn(),
  hasPlayServices: jest.fn().mockResolvedValue(true),
  signIn: jest.fn().mockResolvedValue({ data: { idToken: randUuid() } }),
  signOut: jest.fn().mockResolvedValue(null),
  revokeAccess: jest.fn().mockResolvedValue(null),
  getTokens: jest.fn().mockResolvedValue({ idToken: randUuid() }),
  getCurrentUser: jest.fn(),
}

export default { GoogleSignin }
