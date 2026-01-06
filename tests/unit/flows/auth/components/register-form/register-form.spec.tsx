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
  })
})
