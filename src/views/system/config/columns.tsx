import { Button, Tag, Space } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { SysConfigVO } from '@/types'

interface ConfigColumnsOptions {
  onEdit: (record: SysConfigVO) => void
  onDelete: (configId: number) => void
}

export function getConfigColumns({ onEdit, onDelete }: ConfigColumnsOptions): ColumnsType<SysConfigVO> {
  return [
    {
      title: '参数名称',
      dataIndex: 'configName',
      render: (configName: string) => <span className="font-medium">{configName}</span>,
    },
    {
      title: '参数键名',
      dataIndex: 'configKey',
      render: (configKey: string) => <Tag color="blue">{configKey}</Tag>,
    },
    {
      title: '参数键值',
      dataIndex: 'configValue',
      render: (configValue?: string) => <span className="text-slate-600">{configValue || '-'}</span>,
    },
    {
      title: '系统内置',
      dataIndex: 'configType',
      render: (configType: number) =>
        configType === 1 ? (
          <Tag color="red">是</Tag>
        ) : (
          <Tag color="green">否</Tag>
        ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (remark?: string) => <span className="text-slate-500">{remark || '-'}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (createTime?: string) => <span className="text-slate-500">{createTime || '-'}</span>,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (_: unknown, record: SysConfigVO) => (
        <Space size="small">
          <Button type="link" size="small" icon={<Edit size={14} />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<Trash2 size={14} />} onClick={() => onDelete(record.configId)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
}
