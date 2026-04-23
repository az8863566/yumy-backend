import { upload } from './request'
import type { UploadVO } from '@/types'

export function uploadFile(file: File) {
  return upload<UploadVO>('/admin/v1/upload', file)
}
