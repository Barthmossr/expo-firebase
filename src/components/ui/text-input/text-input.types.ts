import type { TextInputProps as RNTextInputProps } from 'react-native'

type TextInputProps = {
  label?: string
  error?: string
  secureTextEntry?: boolean
} & Omit<RNTextInputProps, 'style'>

export type { TextInputProps }
