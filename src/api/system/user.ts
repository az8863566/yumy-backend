import { get, post, put, del } from '../request'
import type { SysUserVO, SysUserQueryDTO, PageResult } from '@/types'

export function getSysUserPage(params: SysUserQueryDTO) {
  return get<PageResult<SysUserVO>>('/admin/v1/sys-user/page', params)
}

export function getSysUserDetail(userId: number) {
  return get<SysUserVO>(`/admin/v1/sys-user/${userId}`)
}

export function createSysUser(data: unknown) {
  return post<void>('/admin/v1/sys-user', data)
}

export function updateSysUser(data: unknown) {
  return put<void>('/admin/v1/sys-user', data)
}

export function deleteSysUser(userId: number) {
  return del<void>(`/admin/v1/sys-user/${userId}`)
}
