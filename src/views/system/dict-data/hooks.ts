import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getDictDataPage, getDictDataByType, deleteDictData, updateDictData, createDictData } from '@/api/system/dictData'
import type { SysDictDataQueryDTO } from '@/types'

export function useDictDataPageQuery(initialDictType?: string) {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useState<Partial<SysDictDataQueryDTO>>({
    dictType: initialDictType,
    dictLabel: undefined,
    status: undefined,
  })

  const byTypeQuery = useQuery({
    queryKey: ['sys-dict-data', 'by-type', initialDictType],
    queryFn: () => getDictDataByType(initialDictType!),
    enabled: !!initialDictType,
  })

  const pageQuery = useQuery({
    queryKey: ['sys-dict-data', 'page', pagination, searchParams],
    queryFn: () => {
      const params: SysDictDataQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      }
      return getDictDataPage(params)
    },
    enabled: !initialDictType,
  })

  const isByType = !!initialDictType
  const data = isByType
    ? { records: byTypeQuery.data || [], total: (byTypeQuery.data || []).length }
    : pageQuery.data
  const isLoading = isByType ? byTypeQuery.isLoading : pageQuery.isLoading
  const refetch = isByType ? byTypeQuery.refetch : pageQuery.refetch

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

export function useDictDataMutations() {
  const deleteMut = useMutation({ mutationFn: deleteDictData })
  const updateMut = useMutation({ mutationFn: updateDictData })
  const createMut = useMutation({ mutationFn: createDictData })

  return { deleteMut, updateMut, createMut }
}
