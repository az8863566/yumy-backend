import { get, post, put, del } from '../request'
import type { PageResult } from '@/types'

export interface SysDictVO {
  dictId: number
  name: string
  code: string
  items: string
  createTime?: string
}

export function getDictPage(params: { pageNum: number; pageSize: number }) {
  return get<PageResult<SysDictVO>>('/admin/v1/dict/type/page', params)
}

export function createDict(data: unknown) {
  return post<void>('/admin/v1/dict/type', data)
}

export function updateDict(data: unknown) {
  return put<void>('/admin/v1/dict/type', data)
}

export function deleteDict(dictId: number) {
  return del<void>(`/admin/v1/dict/type/${dictId}`)
}
