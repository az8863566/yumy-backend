import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getMenuTree, deleteMenu, updateMenu, createMenu } from '@/api/system/menu'
import type { SysMenuQueryDTO } from '@/types'

export function useMenuTreeQuery() {
  const [searchParams, setSearchParams] = useState<Partial<SysMenuQueryDTO>>({
    menuName: undefined,
    status: undefined,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sys-menu', 'tree', searchParams],
    queryFn: () => {
      const params: SysMenuQueryDTO = {
        ...searchParams,
      }
      return getMenuTree(params)
    },
  })

  const refreshList = useCallback(() => refetch(), [refetch])

  return {
    data,
    isLoading,
    searchParams,
    setSearchParams,
    refreshList,
  }
}

export function useMenuMutations() {
  const deleteMut = useMutation({ mutationFn: deleteMenu })
  const updateMut = useMutation({ mutationFn: updateMenu })
  const createMut = useMutation({ mutationFn: createMenu })

  return { deleteMut, updateMut, createMut }
}
