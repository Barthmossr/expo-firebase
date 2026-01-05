import * as bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10
const OTP_LENGTH = 6

const generateOTP = (): string => {
  const min = 100000
  const max = 999999
  return Math.floor(Math.random() * (max - min + 1) + min).toString()
}

const hashString = async (value: string): Promise<string> => {
  return bcrypt.hash(value, SALT_ROUNDS)
}

const compareHash = async (value: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(value, hash)
}

const isOTPExpired = (expiresAt: FirebaseFirestore.Timestamp): boolean => {
  const now = Date.now()
  const expiryTime = expiresAt.toMillis()
  return now > expiryTime
}

const createExpiryTimestamp = (
  admin: typeof import('firebase-admin'),
  minutesFromNow: number,
): FirebaseFirestore.Timestamp => {
  const expiryDate = new Date(Date.now() + minutesFromNow * 60 * 1000)
  return admin.firestore.Timestamp.fromDate(expiryDate)
}

export {
  generateOTP,
  hashString,
  compareHash,
  isOTPExpired,
  createExpiryTimestamp,
  OTP_LENGTH,
  SALT_ROUNDS,
}
