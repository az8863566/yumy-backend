import { get, post, put, del } from '../request'
import type { PageResult, SysDictDataVO, SysDictDataQueryDTO, SysDictDataCreateDTO, SysDictDataUpdateDTO } from '@/types'

export type { SysDictDataVO }

export function getDictDataPage(params: SysDictDataQueryDTO) {
  return get<PageResult<SysDictDataVO>>('/admin/v1/dict/data/page', params)
}

export function getDictDataDetail(dictCode: string) {
  return get<SysDictDataVO>(`/admin/v1/dict/data/${dictCode}`)
}

export function getDictDataByType(dictType: string) {
  return get<SysDictDataVO[]>(`/admin/v1/dict/data/type/${dictType}`)
}

export function createDictData(data: SysDictDataCreateDTO) {
  return post<void>('/admin/v1/dict/data', data)
}

export function updateDictData(data: SysDictDataUpdateDTO) {
  return put<void>('/admin/v1/dict/data', data)
}

export function deleteDictData(dictCode: string) {
  return del<void>(`/admin/v1/dict/data/${dictCode}`)
}
