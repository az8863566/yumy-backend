import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { Layout, Breadcrumb, Input, Badge } from 'antd'
import { Search, Bell } from 'lucide-react'
import { menuConfig } from '@/config/menu'
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

  const breadcrumbItems = useMemo(() => {
    const path = findMenuPath(menuConfig, location.pathname)
    return path.map((item) => ({
      title: item.label,
    }))
  }, [location.pathname])

  return (
    <AntHeader className="!bg-white !px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm h-16">
      <Breadcrumb items={breadcrumbItems} />

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
