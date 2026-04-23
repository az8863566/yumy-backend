import { get, put } from '../request'
import type {
  TocUserVO,
  TocUserQueryDTO,
  TocUserStatusDTO,
  PageResult,
} from '@/types'

export function getTocUserPage(params: TocUserQueryDTO) {
  return get<PageResult<TocUserVO>>('/admin/v1/toc-user/page', params)
}

export function getTocUserDetail(userId: number) {
  return get<TocUserVO>(`/admin/v1/toc-user/${userId}`)
}

export function updateTocUserStatus(userId: number, data: TocUserStatusDTO) {
  return put<void>(`/admin/v1/toc-user/${userId}/status`, data)
}
