import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getRolePage, deleteRole, updateRole, createRole } from '@/api/system/role'
import type { SysRoleQueryDTO } from '@/types'

export function useRolePageQuery() {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useState<Partial<SysRoleQueryDTO>>({
    roleName: undefined,
    roleCode: undefined,
    status: undefined,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sys-role', 'page', pagination, searchParams],
    queryFn: () => {
      const params: SysRoleQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      }
      return getRolePage(params)
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

export function useRoleMutations() {
  const deleteMut = useMutation({ mutationFn: deleteRole })
  const updateMut = useMutation({ mutationFn: updateRole })
  const createMut = useMutation({ mutationFn: createRole })

  return { deleteMut, updateMut, createMut }
}
