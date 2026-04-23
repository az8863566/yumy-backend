import { get, post, put, del } from '../request'
import type {
  TocCategoryTreeVO,
  TocParentCategoryCreateDTO,
  TocParentCategoryUpdateDTO,
  TocSubCategoryCreateDTO,
  TocSubCategoryUpdateDTO,
} from '@/types'

export function getCategoryTree() {
  return get<TocCategoryTreeVO[]>('/admin/v1/category/tree')
}

export function createParentCategory(data: TocParentCategoryCreateDTO) {
  return post<void>('/admin/v1/category/parent', data)
}

export function updateParentCategory(data: TocParentCategoryUpdateDTO) {
  return put<void>('/admin/v1/category/parent', data)
}

export function deleteParentCategory(categoryId: number) {
  return del<void>(`/admin/v1/category/parent/${categoryId}`)
}

export function createSubCategory(data: TocSubCategoryCreateDTO) {
  return post<void>('/admin/v1/category/sub', data)
}

export function updateSubCategory(data: TocSubCategoryUpdateDTO) {
  return put<void>('/admin/v1/category/sub', data)
}

export function deleteSubCategory(categoryId: number) {
  return del<void>(`/admin/v1/category/sub/${categoryId}`)
}
