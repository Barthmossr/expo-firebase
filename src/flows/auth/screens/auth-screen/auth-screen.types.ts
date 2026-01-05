type AuthView = 'login' | 'register' | 'forgot-password' | 'verify-email'

type AuthScreenProps = {
  initialView?: AuthView
}

export type { AuthScreenProps, AuthView }
