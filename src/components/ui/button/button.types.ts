type ButtonVariant = 'primary' | 'secondary' | 'google'

type ButtonProps = {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  disabled?: boolean
  loading?: boolean
}

export type { ButtonProps, ButtonVariant }
