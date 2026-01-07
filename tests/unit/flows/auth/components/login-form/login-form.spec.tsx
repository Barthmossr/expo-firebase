import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { randEmail, randPassword } from '@ngneat/falso'
import { LoginForm } from '@/flows/auth/components/login-form'
import { useAuth } from '@/hooks/auth'
import { createMockAuthContext } from '../../__mocks__/auth.mocks'

jest.mock('@/hooks/auth')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('LoginForm', () => {
  const mockSignIn = jest.fn()
  const mockOnForgotPassword = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      ...createMockAuthContext(),
      signIn: mockSignIn,
    })
  })

  describe('rendering', () => {
    it('should render email and password fields', () => {
      const { getByPlaceholderText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      expect(getByPlaceholderText('Enter your email')).toBeDefined()
      expect(getByPlaceholderText('Enter your password')).toBeDefined()
    })

    it('should render login button', () => {
      const { getByText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      expect(getByText('Login')).toBeDefined()
    })

    it('should render forgot password link', () => {
      const { getByText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      expect(getByText('Forgot password?')).toBeDefined()
    })
  })

  describe('form validation', () => {
    it('should show error when email is empty', async () => {
      const { getByText, getByPlaceholderText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, 'password123')

      const loginButton = getByText('Login')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(getByText('Email is required')).toBeDefined()
      })
    })

    it('should show error when email is invalid', async () => {
      const { getByText, getByPlaceholderText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, 'invalid-email')

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, 'password123')

      const loginButton = getByText('Login')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(getByText('Please enter a valid email address')).toBeDefined()
      })
    })
  })
})
