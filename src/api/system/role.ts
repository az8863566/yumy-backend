import { get, post, put, del } from '../request'
import type { PageResult, SysRoleVO, SysRoleQueryDTO, SysRoleCreateDTO, SysRoleUpdateDTO } from '@/types'

export type { SysRoleVO }

export function getRolePage(params: SysRoleQueryDTO) {
  return get<PageResult<SysRoleVO>>('/admin/v1/role/page', params)
}

export function getRoleDetail(roleId: string) {
  return get<SysRoleVO>(`/admin/v1/role/${roleId}`)
}

export function createRole(data: SysRoleCreateDTO) {
  return post<void>('/admin/v1/role', data)
}

export function updateRole(data: SysRoleUpdateDTO) {
  return put<void>('/admin/v1/role', data)
}

export function deleteRole(roleId: string) {
  return del<void>(`/admin/v1/role/${roleId}`)
}
