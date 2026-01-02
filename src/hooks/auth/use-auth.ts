import { useContext } from 'react'
import { AuthContext } from '@/providers/auth'
import type { UseAuthOutput } from './use-auth.types'

const useAuth = (): UseAuthOutput => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { useAuth }
