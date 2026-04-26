import { Button, Tag, Space } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { SysDictDataVO } from '@/types'

interface DictDataColumnsOptions {
  onEdit: (record: SysDictDataVO) => void
  onDelete: (dictCode: string) => void
}

export function getDictDataColumns({ onEdit, onDelete }: DictDataColumnsOptions): ColumnsType<SysDictDataVO> {
  return [
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      render: (dictLabel: string) => <span className="font-medium">{dictLabel}</span>,
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
      render: (dictValue: string) => <Tag color="cyan">{dictValue}</Tag>,
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      render: (dictType: string) => <Tag color="blue">{dictType}</Tag>,
    },
    {
      title: '排序',
      dataIndex: 'dictSort',
      render: (dictSort: number) => dictSort ?? '-',
    },
    {
      title: '回显样式',
      dataIndex: 'listClass',
      render: (listClass: string) => (listClass ? <Tag>{listClass}</Tag> : '-'),
    },
    {
      title: '是否默认',
      dataIndex: 'isDefault',
      render: (isDefault: number) =>
        isDefault === 1 ? (
          <span className="text-blue-600">是</span>
        ) : (
          <span className="text-gray-400">否</span>
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
      render: (_: unknown, record: SysDictDataVO) => (
        <Space>
          <Button type="link" icon={<Edit size={14} />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => onDelete(record.dictCode)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
}
