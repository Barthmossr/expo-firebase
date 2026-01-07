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

    it('should show error when password is empty', async () => {
      const { getByText, getByPlaceholderText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, randEmail())

      const loginButton = getByText('Login')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(getByText('Password is required')).toBeDefined()
      })
    })
  })

  describe('form submission', () => {
    it('should call signIn with correct credentials', async () => {
      const email = randEmail()
      const password = randPassword()

      mockSignIn.mockResolvedValue(undefined)

      const { getByText, getByPlaceholderText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, password)

      const loginButton = getByText('Login')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email,
          password,
        })
      })
    })

    it('should not call signIn when form is invalid', async () => {
      const { getByText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      const loginButton = getByText('Login')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(mockSignIn).not.toHaveBeenCalled()
      })
    })

    it('should handle signIn error', async () => {
      const email = randEmail()
      const password = randPassword()

      mockSignIn.mockRejectedValue(new Error('Invalid credentials'))

      const { getByText, getByPlaceholderText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, password)

      const loginButton = getByText('Login')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalled()
      })
    })
  })

  describe('loading state', () => {
    it('should show loading button when isLoading is true', () => {
      mockUseAuth.mockReturnValue({
        ...createMockAuthContext(),
        isLoading: true,
      })

      const { UNSAFE_getAllByType } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      const activityIndicators = UNSAFE_getAllByType('ActivityIndicator' as any)
      expect(activityIndicators.length).toBeGreaterThan(0)
    })
  })

  describe('error display', () => {
    it('should display auth error message', () => {
      mockUseAuth.mockReturnValue({
        ...createMockAuthContext(),
        error: {
          code: 'auth/invalid-credential',
          message: 'Invalid credentials',
        },
      })

      const { getByText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      expect(getByText('Invalid email or password')).toBeDefined()
    })
  })

  describe('forgot password', () => {
    it('should call onForgotPassword when link is pressed', () => {
      const { getByText } = render(
        <LoginForm onForgotPassword={mockOnForgotPassword} />,
      )

      const forgotPasswordLink = getByText('Forgot password?')
      fireEvent.press(forgotPasswordLink)

      expect(mockOnForgotPassword).toHaveBeenCalledTimes(1)
    })
  })
})
