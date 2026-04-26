import { get } from '../request'
import type { PageResult, SysOperLogVO, SysOperLogQueryDTO } from '@/types'

export type { SysOperLogVO }

export function getOperLogPage(params: SysOperLogQueryDTO) {
  return get<PageResult<SysOperLogVO>>('/admin/v1/oper-log/page', params)
}
