import { get, post, put, del } from '../request'
import type { PageResult, SysDictTypeVO, SysDictTypeQueryDTO, SysDictTypeCreateDTO, SysDictTypeUpdateDTO } from '@/types'

export type { SysDictTypeVO }

export function getDictTypePage(params: SysDictTypeQueryDTO) {
  return get<PageResult<SysDictTypeVO>>('/admin/v1/dict/type/page', params)
}

export function getDictTypeDetail(dictId: string) {
  return get<SysDictTypeVO>(`/admin/v1/dict/type/${dictId}`)
}

export function createDictType(data: SysDictTypeCreateDTO) {
  return post<void>('/admin/v1/dict/type', data)
}

export function updateDictType(data: SysDictTypeUpdateDTO) {
  return put<void>('/admin/v1/dict/type', data)
}

export function deleteDictType(dictId: string) {
  return del<void>(`/admin/v1/dict/type/${dictId}`)
}
