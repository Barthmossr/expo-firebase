import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { randEmail, randFullName, randPassword } from '@ngneat/falso'
import { RegisterForm } from '@/flows/auth/components/register-form'
import { getOTPService } from '@/services/otp'
import { createMockOTPService } from '@tests/unit/adapters/firebase/otp/__mocks__'

jest.mock('@/services/otp')

const mockGetOTPService = getOTPService as jest.MockedFunction<
  typeof getOTPService
>

describe('RegisterForm', () => {
  const mockSendVerificationCode = jest.fn()
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetOTPService.mockReturnValue({
      ...createMockOTPService(),
      sendVerificationCode: mockSendVerificationCode,
    })
  })

  describe('rendering', () => {
    it('should render name, email and password fields', () => {
      const { getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      expect(getByPlaceholderText('Enter your name')).toBeDefined()
      expect(getByPlaceholderText('Enter your email')).toBeDefined()
      expect(getByPlaceholderText('Enter your password')).toBeDefined()
    })

    it('should render register button', () => {
      const { getByText } = render(<RegisterForm onSuccess={mockOnSuccess} />)

      expect(getByText('Create Account')).toBeDefined()
    })
  })

  describe('form validation', () => {
    it('should show error when name is empty', async () => {
      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, randEmail())

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, 'Password123')

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(getByText('Name is required')).toBeDefined()
      })
    })

    it('should show error when name is too short', async () => {
      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, 'A')

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, randEmail())

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, 'Password123')

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(getByText('Name must be at least 2 characters')).toBeDefined()
      })
    })

    it('should show error when email is empty', async () => {
      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, randFullName())

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, 'Password123')

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(getByText('Email is required')).toBeDefined()
      })
    })

    it('should show error when email is invalid', async () => {
      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, randFullName())

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, 'invalid-email')

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, 'Password123')

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(getByText('Please enter a valid email address')).toBeDefined()
      })
    })

    it('should show error when password is too short', async () => {
      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, randFullName())

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, randEmail())

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, 'Pass1')

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(
          getByText('Password must be at least 8 characters'),
        ).toBeDefined()
      })
    })

    it('should show error when password has no uppercase', async () => {
      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, randFullName())

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, randEmail())

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, 'password123')

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(
          getByText('Password must contain at least one uppercase letter'),
        ).toBeDefined()
      })
    })

    it('should show error when password has no number', async () => {
      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, randFullName())

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, randEmail())

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, 'Passwordonly')

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(
          getByText('Password must contain at least one number'),
        ).toBeDefined()
      })
    })
  })

  describe('form submission', () => {
    it('should call sendVerificationCode with correct data', async () => {
      const displayName = randFullName()
      const email = randEmail()
      const password = randPassword() + 'A1' // Ensure it meets requirements

      mockSendVerificationCode.mockResolvedValue(undefined)

      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, displayName)

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, password)

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(mockSendVerificationCode).toHaveBeenCalledWith({
          email,
          displayName,
          password,
        })
      })

      await waitFor(() => {
        expect(mockSendVerificationCode).toHaveBeenCalled()
      })
    })

    it('should call onSuccess with email after successful registration', async () => {
      const displayName = randFullName()
      const email = randEmail()
      const password = randPassword() + 'A1'

      mockSendVerificationCode.mockResolvedValue(undefined)

      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, displayName)

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, password)

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(email)
      })

      await waitFor(() => {
        expect(mockSendVerificationCode).toHaveBeenCalled()
      })
    })

    it('should not call sendVerificationCode when form is invalid', async () => {
      const { getByText } = render(<RegisterForm onSuccess={mockOnSuccess} />)

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(mockSendVerificationCode).not.toHaveBeenCalled()
      })
    })

    it('should handle sendVerificationCode error', async () => {
      const displayName = randFullName()
      const email = randEmail()
      const password = randPassword() + 'A1'

      mockSendVerificationCode.mockRejectedValue(
        new Error('Failed to send verification code'),
      )

      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, displayName)

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, password)

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(getByText('Failed to send verification code')).toBeDefined()
      })
    })

    it('should handle non-Error exception', async () => {
      const displayName = randFullName()
      const email = randEmail()
      const password = randPassword() + 'A1'

      mockSendVerificationCode.mockRejectedValue('Unknown error')

      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, displayName)

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, password)

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(getByText('Failed to send verification code')).toBeDefined()
      })
    })
  })

  describe('loading state', () => {
    it('should show loading button during submission', async () => {
      const displayName = randFullName()
      const email = randEmail()
      const password = randPassword() + 'A1'

      let resolveVerification: () => void
      const verificationPromise = new Promise<void>((resolve) => {
        resolveVerification = resolve
      })
      mockSendVerificationCode.mockReturnValue(verificationPromise)

      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, displayName)

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, password)

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(mockSendVerificationCode).toHaveBeenCalled()
      })

      act(() => {
        resolveVerification!()
      })

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should clear loading state after error', async () => {
      const displayName = randFullName()
      const email = randEmail()
      const password = randPassword() + 'A1'

      mockSendVerificationCode.mockRejectedValue(new Error('Test error'))

      const { getByText, getByPlaceholderText } = render(
        <RegisterForm onSuccess={mockOnSuccess} />,
      )

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, displayName)

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, password)

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(getByText('Test error')).toBeDefined()
      })

      expect(registerButton.parent?.parent?.props['disabled']).toBeFalsy()
    })
  })

  describe('optional onSuccess callback', () => {
    it('should work without onSuccess callback', async () => {
      const displayName = randFullName()
      const email = randEmail()
      const password = randPassword() + 'A1'

      mockSendVerificationCode.mockResolvedValue(undefined)

      const { getByText, getByPlaceholderText } = render(<RegisterForm />)

      const nameInput = getByPlaceholderText('Enter your name')
      fireEvent.changeText(nameInput, displayName)

      const emailInput = getByPlaceholderText('Enter your email')
      fireEvent.changeText(emailInput, email)

      const passwordInput = getByPlaceholderText('Enter your password')
      fireEvent.changeText(passwordInput, password)

      const registerButton = getByText('Create Account')
      act(() => {
        fireEvent.press(registerButton)
      })

      await waitFor(() => {
        expect(mockSendVerificationCode).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(mockSendVerificationCode).toHaveBeenCalledTimes(1)
      })
    })
  })
})
