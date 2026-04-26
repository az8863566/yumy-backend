import { get, post, put, del } from '../request'
import type { SysUserVO, SysUserQueryDTO, SysUserCreateDTO, SysUserUpdateDTO, PageResult } from '@/types'

export function getSysUserPage(params: SysUserQueryDTO) {
  return get<PageResult<SysUserVO>>('/admin/v1/user/page', params)
}

export function getSysUserDetail(userId: string) {
  return get<SysUserVO>(`/admin/v1/user/${userId}`)
}

export function createSysUser(data: SysUserCreateDTO) {
  return post<void>('/admin/v1/user', data)
}

export function updateSysUser(data: SysUserUpdateDTO) {
  return put<void>('/admin/v1/user', data)
}

export function deleteSysUser(userId: string) {
  return del<void>(`/admin/v1/user/${userId}`)
}
