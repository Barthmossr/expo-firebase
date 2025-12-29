import type {
  StorageUploadResult,
  StorageDownloadResult,
  StorageMetadata,
} from './storage.types'

type StoragePort = {
  upload: (
    path: string,
    data: Blob | ArrayBuffer | string,
    metadata?: StorageMetadata,
  ) => Promise<StorageUploadResult>
  download: (path: string) => Promise<StorageDownloadResult>
  delete: (path: string) => Promise<void>
  getDownloadUrl: (path: string) => Promise<string>
  listFiles: (path: string) => Promise<string[]>
}

export type { StoragePort }
