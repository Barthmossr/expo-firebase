import { randEmail, randPassword, randFullName } from '@ngneat/falso'
import type { OTPVerificationResult, OTPPort } from '@/core/ports/otp'

const MOCK_TEST_PROJECT_ID = 'mock-test-project-id'
const MOCK_TEST_REGION = 'southamerica-east1'

const createMockOTPVerificationResult = (
  overrides?: Partial<OTPVerificationResult>,
): OTPVerificationResult => ({
  success: true,
  email: randEmail(),
  password: randPassword(),
  displayName: randFullName(),
  ...overrides,
})

const createMockOTPService = (): OTPPort => ({
  sendVerificationCode: jest.fn(),
  verifyCode: jest.fn(),
  resendCode: jest.fn(),
})

export {
  createMockOTPVerificationResult,
  createMockOTPService,
  MOCK_TEST_PROJECT_ID,
  MOCK_TEST_REGION,
}
