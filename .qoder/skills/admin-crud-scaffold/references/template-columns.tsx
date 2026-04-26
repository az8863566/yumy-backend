import { Button, Tag, Space } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { SysXxxVO } from '@/types'

interface XxxColumnsOptions {
  onEdit: (record: SysXxxVO) => void
  onDelete: (id: number) => void
}

export function getXxxColumns({ onEdit, onDelete }: XxxColumnsOptions): ColumnsType<SysXxxVO> {
  return [
    {
      title: '名称',
      dataIndex: 'name',
      render: (name: string) => <span className="font-medium">{name}</span>,
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
      render: (_: unknown, record: SysXxxVO) => (
        <Space>
          <Button type="link" icon={<Edit size={14} />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => onDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
}
