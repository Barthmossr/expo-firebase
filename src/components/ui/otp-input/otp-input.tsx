import { useRef, useEffect, useState } from 'react'
import { View, TextInput, Keyboard } from 'react-native'
import type { OTPInputProps } from './otp-input.types'
import { styles } from './otp-input.styles'

const OTP_LENGTH = 6

const OTPInput = (props: OTPInputProps): React.ReactElement => {
  const { value, onChange, onComplete, error = false, disabled = false } = props
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputRefs = useRef<Array<TextInput | null>>([])

  const digits = value.padEnd(OTP_LENGTH, ' ').split('').slice(0, OTP_LENGTH)

  useEffect(() => {
    if (value.length === OTP_LENGTH && onComplete) {
      onComplete(value)
    }
  }, [value, onComplete])

  const handleChangeText = (text: string, index: number): void => {
    if (disabled) return

    const newDigits = [...digits]

    if (text.length === OTP_LENGTH) {
      const pastedDigits = text.slice(0, OTP_LENGTH).split('')
      pastedDigits.forEach((digit, i) => {
        if (i < OTP_LENGTH && /^\d$/.test(digit)) {
          newDigits[i] = digit
        }
      })
      const newValue = newDigits.join('').trim()
      onChange(newValue)
      Keyboard.dismiss()
      return
    }

    const digit = text.replace(/[^0-9]/g, '').slice(-1)

    if (digit) {
      newDigits[index] = digit
      const newValue = newDigits.join('').trim()
      onChange(newValue)

      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      } else {
        Keyboard.dismiss()
      }
    }
  }

  const handleKeyPress = (key: string, index: number): void => {
    if (disabled) return

    if (key === 'Backspace') {
      const newDigits = [...digits]

      if (digits[index] && digits[index] !== ' ') {
        newDigits[index] = ' '
        const newValue = newDigits.join('').trim()
        onChange(newValue)
      } else if (index > 0) {
        newDigits[index - 1] = ' '
        const newValue = newDigits.join('').trim()
        onChange(newValue)
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const getInputStyle = (index: number) => {
    const inputStyles: object[] = [styles.input]

    if (focusedIndex === index) {
      inputStyles.push(styles.inputFocused)
    }

    if (error) {
      inputStyles.push(styles.inputError)
    }

    if (disabled) {
      inputStyles.push(styles.inputDisabled)
    }

    return inputStyles
  }

  return (
    <View style={styles.container}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref
          }}
          style={getInputStyle(index)}
          value={digit.trim()}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={({ nativeEvent }) =>
            handleKeyPress(nativeEvent.key, index)
          }
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          editable={!disabled}
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          accessibilityLabel={`Digit ${index + 1}`}
          accessibilityRole="none"
        />
      ))}
    </View>
  )
}

export { OTPInput }
