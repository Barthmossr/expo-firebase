import type { DatabaseDocument, DatabaseQueryOptions } from './database.types'

type DatabasePort = {
  get: <T>(
    collection: string,
    id: string,
  ) => Promise<DatabaseDocument<T> | null>
  list: <T>(
    collection: string,
    options?: DatabaseQueryOptions,
  ) => Promise<DatabaseDocument<T>[]>
  create: <T>(collection: string, data: T) => Promise<DatabaseDocument<T>>
  update: <T>(
    collection: string,
    id: string,
    data: Partial<T>,
  ) => Promise<DatabaseDocument<T>>
  delete: (collection: string, id: string) => Promise<void>
  onSnapshot: <T>(
    collection: string,
    id: string,
    callback: (doc: DatabaseDocument<T> | null) => void,
  ) => () => void
  onCollectionSnapshot: <T>(
    collection: string,
    options: DatabaseQueryOptions,
    callback: (docs: DatabaseDocument<T>[]) => void,
  ) => () => void
}

export type { DatabasePort }
