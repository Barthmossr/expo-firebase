import { randEmail, randFullName, randUuid } from '@ngneat/falso'
import { renderHook } from '@testing-library/react-native'
import { useAuth } from '@/hooks/auth'
import { AuthContext } from '@/providers/auth'
import type { AuthContextValue } from '@/providers/auth'
import type { ReactNode } from 'react'

describe('useAuth', () => {
  it('should throw error when used outside AuthProvider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')

    jest.restoreAllMocks()
  })
})
