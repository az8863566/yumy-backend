import { get, post, put, del } from '../request'

export interface SysMenuVO {
  menuId: number
  name: string
  icon?: string
  path: string
  sort: number
  parentId?: number
  children?: SysMenuVO[]
}

export function getMenuTree() {
  return get<SysMenuVO[]>('/admin/v1/menu/tree')
}

export function createMenu(data: unknown) {
  return post<void>('/admin/v1/menu', data)
}

export function updateMenu(data: unknown) {
  return put<void>('/admin/v1/menu', data)
}

export function deleteMenu(menuId: number) {
  return del<void>(`/admin/v1/menu/${menuId}`)
}
