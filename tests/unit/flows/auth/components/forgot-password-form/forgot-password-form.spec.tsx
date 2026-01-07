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

    it('should render back to login link', () => {
      const { getByText } = render(<ForgotPasswordForm onBack={mockOnBack} />)

      expect(getByText('Back to Login')).toBeDefined()
    })

    it('should render title and subtitle', () => {
      const { getByText } = render(<ForgotPasswordForm onBack={mockOnBack} />)

      expect(getByText('Reset Password')).toBeDefined()
      expect(
        getByText('Enter your email and we will send you a reset link.'),
      ).toBeDefined()
    })
  })

  describe('form validation', () => {
    it('should show error when email is empty', async () => {
      const { getByText } = render(<ForgotPasswordForm onBack={mockOnBack} />)

      const resetButton = getByText('Send Reset Link')
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(getByText('Email is required')).toBeDefined()
      })
    })

    it('should show error when email is invalid', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ForgotPasswordForm onBack={mockOnBack} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, 'invalid-email')

      const resetButton = getByText('Send Reset Link')
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(getByText('Please enter a valid email address')).toBeDefined()
      })
    })
  })

  describe('form submission', () => {
    it('should call sendPasswordResetEmail with correct email', async () => {
      const email = randEmail()

      mockSendPasswordResetEmail.mockResolvedValue(undefined)

      const { getByText, getByPlaceholderText } = render(
        <ForgotPasswordForm onBack={mockOnBack} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const resetButton = getByText('Send Reset Link')
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(email)
      })
    })

    it('should not call sendPasswordResetEmail when form is invalid', async () => {
      const { getByText } = render(<ForgotPasswordForm onBack={mockOnBack} />)

      const resetButton = getByText('Send Reset Link')
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(mockSendPasswordResetEmail).not.toHaveBeenCalled()
      })
    })

    it('should handle sendPasswordResetEmail error', async () => {
      const email = randEmail()

      mockSendPasswordResetEmail.mockRejectedValue(new Error('User not found'))

      const { getByText, getByPlaceholderText } = render(
        <ForgotPasswordForm onBack={mockOnBack} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const resetButton = getByText('Send Reset Link')
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(mockSendPasswordResetEmail).toHaveBeenCalled()
      })
    })
  })

  describe('success state', () => {
    it('should show success message after successful submission', async () => {
      const email = randEmail()

      mockSendPasswordResetEmail.mockResolvedValue(undefined)

      const { getByText, getByPlaceholderText } = render(
        <ForgotPasswordForm onBack={mockOnBack} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const resetButton = getByText('Send Reset Link')
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(getByText('Check your email')).toBeDefined()
      })

      expect(
        getByText('We sent a password reset link to your email address.'),
      ).toBeDefined()
    })

    it('should show back to login button in success state', async () => {
      const email = randEmail()

      mockSendPasswordResetEmail.mockResolvedValue(undefined)

      const { getByText, getByPlaceholderText, getAllByText } = render(
        <ForgotPasswordForm onBack={mockOnBack} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const resetButton = getByText('Send Reset Link')
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(getByText('Check your email')).toBeDefined()
      })

      const backButtons = getAllByText('Back to Login')
      expect(backButtons.length).toBeGreaterThan(0)
    })
  })
})
