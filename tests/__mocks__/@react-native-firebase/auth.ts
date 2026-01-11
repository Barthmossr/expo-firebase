const mockAuth = jest.fn(() => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  currentUser: null,
  onAuthStateChanged: jest.fn(() => jest.fn()),
})) as jest.Mock & {
  GoogleAuthProvider: {
    credential: jest.Mock
  }
}

mockAuth.GoogleAuthProvider = {
  credential: jest.fn(),
}

export default mockAuth
