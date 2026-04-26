import { get, del } from '../request'
import type {
  TocCommentVO,
  TocCommentQueryDTO,
  PageResult,
} from '@/types'

export function getCommentPage(params: TocCommentQueryDTO) {
  return get<PageResult<TocCommentVO>>('/admin/v1/comment/page', params)
}

export function getCommentDetail(commentId: string) {
  return get<TocCommentVO>(`/admin/v1/comment/${commentId}`)
}

export function deleteComment(commentId: string) {
  return del<void>(`/admin/v1/comment/${commentId}`)
}
