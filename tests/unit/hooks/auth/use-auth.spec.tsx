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

  it('should return context value when used within AuthProvider', () => {
    const mockContextValue: AuthContextValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
      verifyEmailAndRegister: jest.fn(),
      error: null,
      clearError: jest.fn(),
    }

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toEqual(mockContextValue)
  })
})
