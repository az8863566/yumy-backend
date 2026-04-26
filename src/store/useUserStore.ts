import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthLoginVO } from '@/types'

interface UserState {
  token: string | null
  userInfo: AuthLoginVO | null
  permissions: string[]
  setToken: (token: string) => void
  setUserInfo: (user: AuthLoginVO) => void
  setPermissions: (permissions: string[]) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      permissions: [],
      setToken: (token) => set({ token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () => {
        set({ token: null, userInfo: null, permissions: [] })
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ token: state.token, userInfo: state.userInfo, permissions: state.permissions }),
    },
  ),
)
