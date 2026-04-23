import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthLoginVO } from '@/types'

interface UserState {
  userInfo: AuthLoginVO | null
  permissions: string[]
  setUserInfo: (user: AuthLoginVO) => void
  setPermissions: (permissions: string[]) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: null,
      permissions: [],
      setUserInfo: (userInfo) => set({ userInfo }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () => {
        set({ userInfo: null, permissions: [] })
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ userInfo: state.userInfo, permissions: state.permissions }),
    },
  ),
)
