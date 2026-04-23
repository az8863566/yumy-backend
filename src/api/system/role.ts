import { get, post, put, del } from '../request'
import type { PageResult } from '@/types'

export interface SysRoleVO {
  roleId: number
  name: string
  code: string
  status: number
  createTime?: string
}

export function getRolePage(params: { pageNum: number; pageSize: number }) {
  return get<PageResult<SysRoleVO>>('/admin/v1/role/page', params)
}

export function createRole(data: unknown) {
  return post<void>('/admin/v1/role', data)
}

export function updateRole(data: unknown) {
  return put<void>('/admin/v1/role', data)
}

export function deleteRole(roleId: number) {
  return del<void>(`/admin/v1/role/${roleId}`)
}
