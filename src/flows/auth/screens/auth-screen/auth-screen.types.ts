type AuthView = 'login' | 'register' | 'forgot-password'

type AuthScreenProps = {
  initialView?: AuthView
}

export type { AuthScreenProps, AuthView }
