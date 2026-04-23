import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Layout, Menu, Avatar } from 'antd'
import {
  Settings,
  Users,
  ShieldCheck,
  Menu as MenuIcon,
  FileText,
  BookOpen,
  SlidersHorizontal,
  LayoutDashboard,
  FolderTree,
  MessageSquare,
  Image,
  LogOut,
} from 'lucide-react'
import { menuConfig } from '@/config/menu'
import { useUserStore } from '@/store/useUserStore'
import { logout as apiLogout } from '@/api/auth'
import type { MenuConfig } from '@/config/menu'

const { Sider } = Layout

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Settings,
  Users,
  ShieldCheck,
  Menu: MenuIcon,
  FileText,
  BookOpen,
  SlidersHorizontal,
  LayoutDashboard,
  FolderTree,
  MessageSquare,
  Image,
}

function renderMenuItems(items: MenuConfig[]) {
  return items.map((item) => {
    const Icon = item.icon ? iconMap[item.icon] : undefined
    const menuItem: {
      key: string
      icon?: React.ReactNode
      label: React.ReactNode
      children?: unknown
    } = {
      key: item.key,
      icon: Icon ? <Icon size={16} /> : undefined,
      label: <span>{item.label}</span>,
    }

    if (item.children && item.children.length > 0) {
      menuItem.children = renderMenuItems(item.children)
    }

    return menuItem
  })
}

function getAllKeys(items: MenuConfig[]): string[] {
  const keys: string[] = []
  items.forEach((item) => {
    keys.push(item.key)
    if (item.children) {
      keys.push(...getAllKeys(item.children))
    }
  })
  return keys
}

function findParentKey(items: MenuConfig[], targetKey: string): string | undefined {
  for (const item of items) {
    if (item.children) {
      if (item.children.some((child) => child.key === targetKey)) {
        return item.key
      }
      const found = findParentKey(item.children, targetKey)
      if (found) return found
    }
  }
  return undefined
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userInfo, logout } = useUserStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await apiLogout()
    } finally {
      logout()
    }
  }

  const selectedKey = useMemo(() => {
    const allKeys = getAllKeys(menuConfig)
    const matched = allKeys.find((key) => {
      const config = findMenuConfig(menuConfig, key)
      return config?.path === location.pathname
    })
    return matched || ''
  }, [location.pathname])

  const openKeys = useMemo(() => {
    const parentKey = findParentKey(menuConfig, selectedKey)
    return parentKey ? [parentKey] : []
  }, [selectedKey])

  const handleClick = ({ key }: { key: string }) => {
    const config = findMenuConfig(menuConfig, key)
    if (config?.path) {
      navigate(config.path)
    }
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={220}
      className="!bg-[#1a1d29]"
    >
      <div
        className="h-16 flex items-center justify-center text-white font-bold text-lg border-b border-white/10 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center mr-2 text-sm">
          后
        </div>
        {!collapsed && <span>后羿管理系统</span>}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        items={renderMenuItems(menuConfig) as unknown as []}
        onClick={handleClick}
        className="!bg-transparent !border-0"
        style={{ background: 'transparent' }}
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="flex items-center text-white/80">
          <Avatar size="small" className="!bg-blue-600 flex-shrink-0">
            {userInfo?.nickname?.charAt(0) || '管'}
          </Avatar>
          {!collapsed && (
            <div className="ml-3 flex-1 min-w-0">
              <div className="text-sm truncate">{userInfo?.nickname || '超级管理员'}</div>
              <div className="text-xs text-white/50 truncate">@{userInfo?.username || 'admin'}</div>
            </div>
          )}
          {!collapsed && (
            <LogOut
              size={16}
              className="cursor-pointer hover:text-white ml-2 flex-shrink-0"
              onClick={handleLogout}
            />
          )}
        </div>
      </div>
    </Sider>
  )
}

function findMenuConfig(items: MenuConfig[], key: string): MenuConfig | undefined {
  for (const item of items) {
    if (item.key === key) return item
    if (item.children) {
      const found = findMenuConfig(item.children, key)
      if (found) return found
    }
  }
  return undefined
}
