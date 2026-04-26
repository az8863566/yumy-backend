import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { Layout, Breadcrumb, Input, Badge, Spin } from 'antd'
import { Search, Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getUserMenuTree } from '@/api/system/menu'
import { transformMenuData } from '@/config/menu'
import type { MenuConfig } from '@/config/menu'

const { Header: AntHeader } = Layout

function findMenuPath(items: MenuConfig[], path: string): MenuConfig[] {
  for (const item of items) {
    if (item.path === path) {
      return [item]
    }
    if (item.children) {
      const childPath = findMenuPath(item.children, path)
      if (childPath.length > 0) {
        return [item, ...childPath]
      }
    }
  }
  return []
}

export default function Header() {
  const location = useLocation()

  const { data: menuTree } = useQuery({
    queryKey: ['sys-menu', 'user-tree'],
    queryFn: getUserMenuTree,
  })

  const menuData = useMemo(() => {
    if (!menuTree) return []
    return transformMenuData(menuTree)
  }, [menuTree])

  const breadcrumbItems = useMemo(() => {
    const path = findMenuPath(menuData, location.pathname)
    return path.map((item) => ({
      title: item.label,
    }))
  }, [location.pathname, menuData])

  return (
    <AntHeader className="!bg-white !px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm h-16">
      {menuData.length === 0 ? <Spin size="small" /> : <Breadcrumb items={breadcrumbItems} />}

      <div className="flex items-center gap-4">
        <Input
          prefix={<Search size={16} className="text-gray-400" />}
          placeholder="搜索..."
          className="w-64"
          variant="filled"
        />
        <Badge count={5} size="small">
          <Bell size={20} className="text-gray-500 cursor-pointer hover:text-primary" />
        </Badge>
      </div>
    </AntHeader>
  )
}
