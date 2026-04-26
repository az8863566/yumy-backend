import { Button, Tag, Space, Avatar } from 'antd'
import { Edit, Trash2, Phone, Mail } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { SysUserVO } from '@/types'

interface UserColumnsOptions {
  onEdit: (record: SysUserVO) => void
  onDelete: (userId: string) => void
}

export function getUserColumns({ onEdit, onDelete }: UserColumnsOptions): ColumnsType<SysUserVO> {
  return [
    {
      title: '用户',
      dataIndex: 'nickname',
      render: (_: unknown, record: SysUserVO) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} className="!bg-blue-500 flex-shrink-0">
            {!record.avatar ? (record.nickname || record.username).charAt(0) : null}
          </Avatar>
          <div>
            <div className="font-medium">{record.nickname || record.username}</div>
            <div className="text-gray-400 text-sm flex items-center gap-1">
              <Mail size={12} />
              {record.email || '-'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      render: (phone: string) =>
        phone ? (
          <span className="flex items-center gap-1">
            <Phone size={12} />
            {phone}
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: '所属角色',
      dataIndex: 'roleNames',
      render: (roleNames: string) =>
        roleNames ? (
          <Space size={4} wrap>
            {roleNames.split(',').map((name) => (
              <Tag key={name} color="blue">{name}</Tag>
            ))}
          </Space>
        ) : (
          <span className="text-gray-400">-</span>
        ),
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
      title: '创建时间',
      dataIndex: 'createTime',
      render: (t: string) => t || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: SysUserVO) => (
        <Space>
          <Button type="link" icon={<Edit size={14} />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => onDelete(record.userId)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
}
