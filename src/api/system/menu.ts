import { get, post, put, del } from '../request'
import type { SysMenuVO, SysMenuQueryDTO, SysMenuCreateDTO, SysMenuUpdateDTO } from '@/types'

export type { SysMenuVO }

export function getMenuTree(params: SysMenuQueryDTO) {
  return get<SysMenuVO[]>('/admin/v1/menu/tree', params)
}

export function getUserMenuTree() {
  return get<SysMenuVO[]>('/admin/v1/menu/tree')
}

export function getMenuDetail(menuId: string) {
  return get<SysMenuVO>(`/admin/v1/menu/${menuId}`)
}

export function createMenu(data: SysMenuCreateDTO) {
  return post<void>('/admin/v1/menu', data)
}

export function updateMenu(data: SysMenuUpdateDTO) {
  return put<void>('/admin/v1/menu', data)
}

export function deleteMenu(menuId: string) {
  return del<void>(`/admin/v1/menu/${menuId}`)
}
