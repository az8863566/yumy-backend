import { Button, Tag, Space } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { SysRoleVO } from '@/types'

interface RoleColumnsOptions {
  onEdit: (record: SysRoleVO) => void
  onDelete: (roleId: string) => void
}

export function getRoleColumns({ onEdit, onDelete }: RoleColumnsOptions): ColumnsType<SysRoleVO> {
  return [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      render: (roleName: string) => <span className="font-medium">{roleName}</span>,
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      render: (roleCode: string) => <Tag color="blue">{roleCode}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) =>
        status === 1 ? (
          <span className="flex items-center gap-1 text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            正常
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            禁用
          </span>
        ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (remark: string) => remark || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (t: string) => t || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: SysRoleVO) => (
        <Space>
          <Button type="link" icon={<Edit size={14} />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => onDelete(record.roleId)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
}
