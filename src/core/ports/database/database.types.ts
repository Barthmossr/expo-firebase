type DatabaseDocument<T = Record<string, unknown>> = {
  id: string
  data: T
  createdAt?: Date
  updatedAt?: Date
}

type DatabaseQuery = {
  field: string
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'array-contains'
  value: unknown
}

type DatabaseOrderBy = {
  field: string
  direction: 'asc' | 'desc'
}

type DatabaseQueryOptions = {
  where?: DatabaseQuery[]
  orderBy?: DatabaseOrderBy[]
  limit?: number
  startAfter?: unknown
}

export type {
  DatabaseDocument,
  DatabaseQuery,
  DatabaseOrderBy,
  DatabaseQueryOptions,
}
