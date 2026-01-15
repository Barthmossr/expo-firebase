type AuthView =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify-email'
  | 'reset-password'

type AuthScreenProps = {
  initialView?: AuthView
  resetCode?: string
  resetEmail?: string
}

export type { AuthScreenProps, AuthView }
