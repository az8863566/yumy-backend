import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getOperLogPage } from '@/api/system/log'
import type { SysOperLogQueryDTO } from '@/types'

export function useOperLogPageQuery() {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useState<Partial<SysOperLogQueryDTO>>({
    title: undefined,
    businessType: undefined,
    operName: undefined,
    status: undefined,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sys-oper-log', 'page', pagination, searchParams],
    queryFn: () => {
      const params: SysOperLogQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      }
      return getOperLogPage(params)
    },
  })

  const refreshList = useCallback(() => refetch(), [refetch])

  return {
    data,
    isLoading,
    pagination,
    setPagination,
    searchParams,
    setSearchParams,
    refreshList,
  }
}
