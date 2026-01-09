type ProviderValidationResult = {
  canUsePassword: boolean
  shouldUseOAuth: boolean
  message: string | null
}

export type { ProviderValidationResult }
