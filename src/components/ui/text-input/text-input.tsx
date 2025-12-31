import { useState } from 'react'
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  Pressable,
} from 'react-native'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/theme'
import type { TextInputProps } from './text-input.types'

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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
  },
  toggle: {
    paddingHorizontal: SPACING.md,
  },
  toggleText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.accent.primary,
  },
  error: {
    ...TYPOGRAPHY.caption,
    color: COLORS.status.error,
    marginTop: SPACING.xs,
  },
})

export { TextInput }
