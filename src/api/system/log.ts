import { get, del } from '../request'
import type { PageResult } from '@/types'

export interface SysLogVO {
  logId: number
  action: string
  operator: string
  ip: string
  status: string
  time: string
}

export function getLogPage(params: { pageNum: number; pageSize: number }) {
  return get<PageResult<SysLogVO>>('/admin/v1/oper-log/page', params)
}

export function deleteLog(logId: number) {
  return del<void>(`/admin/v1/oper-log/${logId}`)
}
