import { useUserStore } from '@/store/useUserStore'

export function useAuth() {
  const { permissions } = useUserStore()

  const hasPermission = (permission: string): boolean => {
    if (!permissions || permissions.length === 0) return false
    return permissions.includes(permission) || permissions.includes('*')
  }

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((p) => hasPermission(p))
  }

  return { hasPermission, hasAnyPermission }
}
