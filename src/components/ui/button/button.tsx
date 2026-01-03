import { Pressable, Text, ActivityIndicator } from 'react-native'
import { COLORS } from '@/theme'
import type { ButtonProps, ButtonVariant } from './button.types'
import { styles } from './button.styles'

const getBackgroundColor = (variant: ButtonVariant, pressed: boolean) => {
  const colors = {
    primary: pressed ? COLORS.button.primaryPressed : COLORS.button.primary,
    secondary: pressed
      ? COLORS.button.secondaryPressed
      : COLORS.button.secondary,
    google: pressed ? COLORS.button.googlePressed : COLORS.button.google,
  }
  return colors[variant]
}

const getTextColor = (variant: ButtonVariant) => {
  return variant === 'google' ? COLORS.text.inverse : COLORS.text.primary
}

const Button = (props: ButtonProps): React.ReactElement => {
  const {
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
  } = props

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled
            ? COLORS.button.disabled
            : getBackgroundColor(variant, pressed),
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor(variant)} />
      ) : (
        <Text style={[styles.text, { color: getTextColor(variant) }]}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}

export { Button }
