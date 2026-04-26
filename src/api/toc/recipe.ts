import { get, post, put, del } from '../request'
import type {
  TocRecipeVO,
  TocRecipeDetailVO,
  TocRecipeQueryDTO,
  TocRecipeCreateDTO,
  TocRecipeUpdateDTO,
  TocRecipeRecommendDTO,
  PageResult,
} from '@/types'

export function getRecipePage(params: TocRecipeQueryDTO) {
  return get<PageResult<TocRecipeVO>>('/admin/v1/recipe/page', params)
}

export function getRecipeDetail(recipeId: string) {
  return get<TocRecipeDetailVO>(`/admin/v1/recipe/${recipeId}`)
}

export function createRecipe(data: TocRecipeCreateDTO) {
  return post<void>('/admin/v1/recipe', data)
}

export function updateRecipe(data: TocRecipeUpdateDTO) {
  return put<void>('/admin/v1/recipe', data)
}

export function deleteRecipe(recipeId: string) {
  return del<void>(`/admin/v1/recipe/${recipeId}`)
}

export function setRecipeRecommend(recipeId: string, data: TocRecipeRecommendDTO) {
  return put<void>(`/admin/v1/recipe/${recipeId}/recommend`, data)
}
