import { get, post, put, del } from '../request'
import type { PageResult, SysConfigVO, SysConfigQueryDTO, SysConfigCreateDTO, SysConfigUpdateDTO } from '@/types'

export type { SysConfigVO }

export function getConfigPage(params: SysConfigQueryDTO) {
  return get<PageResult<SysConfigVO>>('/admin/v1/config/page', params)
}

export function getConfigDetail(configId: number) {
  return get<SysConfigVO>(`/admin/v1/config/${configId}`)
}

export function getConfigByKey(configKey: string) {
  return get<string>(`/admin/v1/config/key/${configKey}`)
}

export function createConfig(data: SysConfigCreateDTO) {
  return post<void>('/admin/v1/config', data)
}

export function updateConfig(data: SysConfigUpdateDTO) {
  return put<void>('/admin/v1/config', data)
}

export function deleteConfig(configId: number) {
  return del<void>(`/admin/v1/config/${configId}`)
}
