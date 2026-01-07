import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { randEmail } from '@ngneat/falso'
import { ForgotPasswordForm } from '@/flows/auth/components/forgot-password-form'
import { useAuth } from '@/hooks/auth'
import { createMockAuthContext } from '../../__mocks__/auth.mocks'

jest.mock('@/hooks/auth')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('ForgotPasswordForm', () => {
  const mockSendPasswordResetEmail = jest.fn()
  const mockOnBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      ...createMockAuthContext(),
      sendPasswordResetEmail: mockSendPasswordResetEmail,
    })
  })

  describe('rendering', () => {
    it('should render email field', () => {
      const { getByPlaceholderText } = render(
        <ForgotPasswordForm onBack={mockOnBack} />,
      )

      expect(getByPlaceholderText('Enter your email')).toBeDefined()
    })

    it('should render reset password button', () => {
      const { getByText } = render(<ForgotPasswordForm onBack={mockOnBack} />)

      expect(getByText('Send Reset Link')).toBeDefined()
    })
  })
})
