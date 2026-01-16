import {
  randEmail,
  randPassword,
  randFullName,
  randUuid,
  randUrl,
  randBoolean,
} from '@ngneat/falso'
import type {
  AuthUser,
  RegisterCredentials,
  AuthCredentials,
} from '@/core/ports/auth'

const createMockAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: randUuid(),
  email: randEmail(),
  displayName: randFullName(),
  photoUrl: randBoolean() ? randUrl() : null,
  emailVerified: randBoolean(),
  ...overrides,
})

const createMockRegisterCredentials = (
  overrides?: Partial<RegisterCredentials>,
): RegisterCredentials => ({
  email: randEmail(),
  password: randPassword(),
  displayName: randFullName(),
  ...overrides,
})

const createMockAuthCredentials = (
  overrides?: Partial<AuthCredentials>,
): AuthCredentials => ({
  email: randEmail(),
  password: randPassword(),
  ...overrides,
})

export {
  createMockAuthUser,
  createMockRegisterCredentials,
  createMockAuthCredentials,
}
