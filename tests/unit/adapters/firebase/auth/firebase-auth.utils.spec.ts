import { ensureUserExists } from '@/adapters/firebase/auth'
import type { AuthUser } from '@/core/ports/auth'
import { randUuid, randEmail, randFullName } from '@ngneat/falso'

describe('firebase-auth.utils', () => {
  describe('ensureUserExists', () => {
    it('should return user when user is not null', () => {
      const user: AuthUser = {
        id: randUuid(),
        email: randEmail(),
        displayName: randFullName(),
        photoUrl: null,
        emailVerified: false,
      }

      const result = ensureUserExists(user)

      expect(result).toBe(user)
    })
  })
})
