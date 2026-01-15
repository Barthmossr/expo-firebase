import type { FunctionsPort } from '@/core/ports/functions'
import { createCloudFunctionsAdapter } from '@/adapters/firebase/functions'

let functionsInstance: FunctionsPort | null = null

const getFunctionsService = (): FunctionsPort => {
  if (!functionsInstance) {
    functionsInstance = createCloudFunctionsAdapter()
  }
  return functionsInstance
}

const resetFunctionsService = (): void => {
  functionsInstance = null
}

export { getFunctionsService, resetFunctionsService }
