import type { FunctionCallOptions, FunctionResult } from './functions.types'

type FunctionsPort = {
  call: <TInput, TOutput>(
    name: string,
    data?: TInput,
    options?: FunctionCallOptions,
  ) => Promise<FunctionResult<TOutput>>
}

export type { FunctionsPort }
