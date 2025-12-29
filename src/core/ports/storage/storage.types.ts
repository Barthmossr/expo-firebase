type StorageUploadResult = {
  url: string
  path: string
  size: number
}

type StorageDownloadResult = {
  url: string
  expiresAt?: Date
}

type StorageMetadata = {
  contentType?: string
  customMetadata?: Record<string, string>
}

export type { StorageUploadResult, StorageDownloadResult, StorageMetadata }
