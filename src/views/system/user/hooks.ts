import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getSysUserPage, deleteSysUser, updateSysUser, createSysUser } from '@/api/system/user'
import { getRolePage } from '@/api/system/role'
import type { SysRoleVO } from '@/api/system/role'
import type { SysUserQueryDTO } from '@/types'

export function useUserPageQuery() {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useState<Partial<SysUserQueryDTO>>({
    username: undefined,
    nickname: undefined,
    phone: undefined,
    status: undefined,
    roleId: undefined,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sys-user', 'page', pagination, searchParams],
    queryFn: () => {
      const params: SysUserQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      }
      return getSysUserPage(params)
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

export function useRoleOptions() {
  const { data: roleData } = useQuery({
    queryKey: ['sys-role', 'all'],
    queryFn: () => getRolePage({ pageNum: 1, pageSize: 100 }),
    staleTime: 5 * 60 * 1000,
  })

  const formRoleOptions = useMemo(
    () => (roleData?.records || []).map((r: SysRoleVO) => ({ label: r.roleName, value: r.roleId })),
    [roleData],
  )

  const searchRoleOptions = useMemo(
    () => [{ label: '全部', value: undefined }, ...formRoleOptions],
    [formRoleOptions],
  )

  return { roleData, formRoleOptions, searchRoleOptions }
}

export function useUserMutations() {
  const deleteMut = useMutation({ mutationFn: deleteSysUser })
  const updateMut = useMutation({ mutationFn: updateSysUser })
  const createMut = useMutation({ mutationFn: createSysUser })

  return { deleteMut, updateMut, createMut }
}
