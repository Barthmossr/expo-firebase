import { useState } from 'react'
import { View, Text, TextInput as RNTextInput, Pressable } from 'react-native'
import { COLORS } from '@/theme'
import type { TextInputProps } from './text-input.types'
import { styles } from './text-input.styles'

const TextInput = (props: TextInputProps): React.ReactElement => {
  const { label, error, secureTextEntry, onFocus, onBlur, ...rest } = props
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleFocus = (event: Parameters<NonNullable<typeof onFocus>>[0]) => {
    setIsFocused(true)
    onFocus?.(event)
  }

  const handleBlur = (event: Parameters<NonNullable<typeof onBlur>>[0]) => {
    setIsFocused(false)
    onBlur?.(event)
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }

  const borderColor = error
    ? COLORS.status.error
    : isFocused
      ? COLORS.border.focus
      : COLORS.border.primary

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, { borderColor }]}>
        <RNTextInput
          style={styles.input}
          placeholderTextColor={COLORS.text.tertiary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {secureTextEntry && (
          <Pressable onPress={togglePasswordVisibility} style={styles.toggle}>
            <Text style={styles.toggleText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

export { TextInput }
