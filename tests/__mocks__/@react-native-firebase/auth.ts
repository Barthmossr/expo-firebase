const mockAuthInstance = {
  currentUser: null,
}

const mockGetAuth = jest.fn(() => mockAuthInstance)
const mockSignInWithEmailAndPassword = jest.fn()
const mockCreateUserWithEmailAndPassword = jest.fn()
const mockSignInWithCredential = jest.fn()
const mockSignOut = jest.fn()
const mockSendPasswordResetEmail = jest.fn()
const mockConfirmPasswordReset = jest.fn()
const mockVerifyPasswordResetCode = jest.fn()
const mockFetchSignInMethodsForEmail = jest.fn()
const mockOnAuthStateChanged = jest.fn(() => jest.fn())
const mockUpdateProfile = jest.fn()

const mockGoogleAuthProvider = {
  credential: jest.fn(),
}

export {
  mockGetAuth as getAuth,
  mockSignInWithEmailAndPassword as signInWithEmailAndPassword,
  mockCreateUserWithEmailAndPassword as createUserWithEmailAndPassword,
  mockSignInWithCredential as signInWithCredential,
  mockSignOut as signOut,
  mockSendPasswordResetEmail as sendPasswordResetEmail,
  mockConfirmPasswordReset as confirmPasswordReset,
  mockVerifyPasswordResetCode as verifyPasswordResetCode,
  mockFetchSignInMethodsForEmail as fetchSignInMethodsForEmail,
  mockOnAuthStateChanged as onAuthStateChanged,
  mockUpdateProfile as updateProfile,
  mockGoogleAuthProvider as GoogleAuthProvider,
  mockAuthInstance,
}
