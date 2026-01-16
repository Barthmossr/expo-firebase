type FunctionCallOptions = {
  timeout?: number
  region?: string
}

type FunctionResult<T = unknown> = {
  data: T
}

export type { FunctionCallOptions, FunctionResult }
