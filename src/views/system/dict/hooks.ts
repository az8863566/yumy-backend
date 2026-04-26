import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getDictTypePage, deleteDictType, updateDictType, createDictType } from '@/api/system/dict'
import type { SysDictTypeQueryDTO } from '@/types'

export function useDictTypePageQuery() {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useState<Partial<SysDictTypeQueryDTO>>({
    dictName: undefined,
    dictType: undefined,
    status: undefined,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sys-dict-type', 'page', pagination, searchParams],
    queryFn: () => {
      const params: SysDictTypeQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      }
      return getDictTypePage(params)
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

export function useDictTypeMutations() {
  const deleteMut = useMutation({ mutationFn: deleteDictType })
  const updateMut = useMutation({ mutationFn: updateDictType })
  const createMut = useMutation({ mutationFn: createDictType })

  return { deleteMut, updateMut, createMut }
}
