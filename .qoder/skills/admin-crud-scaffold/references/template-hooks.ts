import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getXxxPage, deleteXxx, updateXxx, createXxx } from '@/api/{system|toc}/xxx'
import type { SysXxxQueryDTO } from '@/types'

export function useXxxPageQuery() {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useState<Partial<SysXxxQueryDTO>>({
    // 每个查询字段初始化为 undefined，确保重置时能清空
    name: undefined,
    status: undefined,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sys-xxx', 'page', pagination, searchParams],
    queryFn: () => {
      const params: SysXxxQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      }
      return getXxxPage(params)
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

export function useXxxMutations() {
  const deleteMut = useMutation({ mutationFn: deleteXxx })
  const updateMut = useMutation({ mutationFn: updateXxx })
  const createMut = useMutation({ mutationFn: createXxx })

  return { deleteMut, updateMut, createMut }
}
