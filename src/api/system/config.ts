import { get, put } from '../request'

export interface SysConfigVO {
  siteName: string
  copyright: string
}

export function getConfig() {
  return get<SysConfigVO>('/admin/v1/config')
}

export function updateConfig(data: SysConfigVO) {
  return put<void>('/admin/v1/config', data)
}
