import { get, post, put, del } from '../request'
import type {
  TocBannerVO,
  TocBannerQueryDTO,
  TocBannerCreateDTO,
  TocBannerUpdateDTO,
  PageResult,
} from '@/types'

export function getBannerPage(params: TocBannerQueryDTO) {
  return get<PageResult<TocBannerVO>>('/admin/v1/banner/page', params)
}

export function getBannerDetail(bannerId: string) {
  return get<TocBannerVO>(`/admin/v1/banner/${bannerId}`)
}

export function createBanner(data: TocBannerCreateDTO) {
  return post<void>('/admin/v1/banner', data)
}

export function updateBanner(data: TocBannerUpdateDTO) {
  return put<void>('/admin/v1/banner', data)
}

export function deleteBanner(bannerId: string) {
  return del<void>(`/admin/v1/banner/${bannerId}`)
}
