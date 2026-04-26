import { Button, Tag, Space } from 'antd'
import { Edit, Trash2, Database } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { SysDictTypeVO } from '@/types'

interface DictTypeColumnsOptions {
  onEdit: (record: SysDictTypeVO) => void
  onDelete: (dictId: string) => void
  onViewData: (record: SysDictTypeVO) => void
}

export function getDictTypeColumns({ onEdit, onDelete, onViewData }: DictTypeColumnsOptions): ColumnsType<SysDictTypeVO> {
  return [
    {
      title: '字典名称',
      dataIndex: 'dictName',
      render: (dictName: string) => <span className="font-medium">{dictName}</span>,
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      render: (dictType: string) => <Tag color="blue">{dictType}</Tag>,
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
            停用
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
      render: (_: unknown, record: SysDictTypeVO) => (
        <Space>
          <Button type="link" icon={<Edit size={14} />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" icon={<Database size={14} />} onClick={() => onViewData(record)}>
            字典数据
          </Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => onDelete(record.dictId)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
}
