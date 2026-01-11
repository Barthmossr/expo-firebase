type OTPInputProps = {
  value: string
  onChange: (code: string) => void
  onComplete?: (code: string) => void
  error?: boolean
  disabled?: boolean
}

export type { OTPInputProps }
