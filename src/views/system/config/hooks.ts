import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getConfigPage, deleteConfig, updateConfig, createConfig } from '@/api/system/config'
import type { SysConfigQueryDTO } from '@/types'

export function useConfigPageQuery() {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useState<Partial<SysConfigQueryDTO>>({
    configName: undefined,
    configKey: undefined,
    configType: undefined,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sys-config', 'page', pagination, searchParams],
    queryFn: () => {
      const params: SysConfigQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      }
      return getConfigPage(params)
    },
  })

  const refreshList = useCallback(() => refetch(), [refetch])

  return { data, isLoading, pagination, setPagination, searchParams, setSearchParams, refreshList }
}

export function useConfigMutations() {
  const deleteMut = useMutation({ mutationFn: deleteConfig })
  const updateMut = useMutation({ mutationFn: updateConfig })
  const createMut = useMutation({ mutationFn: createConfig })

  return { deleteMut, updateMut, createMut }
}
