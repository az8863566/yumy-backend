import { Button, Tag, Space } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { SysMenuVO } from '@/types'

interface MenuColumnsOptions {
  onEdit: (record: SysMenuVO) => void
  onDelete: (menuId: string) => void
}

export function getMenuColumns({ onEdit, onDelete }: MenuColumnsOptions): ColumnsType<SysMenuVO> {
  return [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      render: (menuName: string) => <span className="font-medium">{menuName}</span>,
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      width: 100,
      render: (menuType: number) => {
        const map: Record<number, { text: string; color: string }> = {
          1: { text: '目录', color: 'blue' },
          2: { text: '菜单', color: 'green' },
          3: { text: '按钮', color: 'orange' },
        }
        const item = map[menuType] || { text: '未知', color: 'default' }
        return <Tag color={item.color}>{item.text}</Tag>
      },
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 100,
      render: (icon: string) => icon || '-',
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      render: (path: string) => path || '-',
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      render: (perms: string) => perms || '-',
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 80,
      render: (sortOrder: number) => sortOrder ?? '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) =>
        status === 1 ? (
          <span className="flex items-center gap-1 text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            正常
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            停用
          </span>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (t: string) => t || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: unknown, record: SysMenuVO) => (
        <Space>
          <Button type="link" icon={<Edit size={14} />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => onDelete(record.menuId)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
}
