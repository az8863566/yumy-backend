import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { SysOperLogVO } from '@/types'

function getBusinessTypeLabel(type: number) {
  const map: Record<number, string> = {
    1: '新增',
    2: '修改',
    3: '删除',
    4: '导出',
    5: '导入',
    6: '查询',
    7: '登录',
    8: '登出',
  }
  return map[type] || '其他'
}

function getBusinessTypeColor(type: number) {
  const map: Record<number, string> = {
    1: 'blue',
    2: 'orange',
    3: 'red',
    4: 'cyan',
    5: 'purple',
    6: 'default',
    7: 'green',
    8: 'gray',
  }
  return map[type] || 'default'
}

function getRequestMethodColor(method: string) {
  const map: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple',
  }
  return map[method?.toUpperCase()] || 'default'
}

export function getOperLogColumns(): ColumnsType<SysOperLogVO> {
  return [
    {
      title: '模块标题',
      dataIndex: 'title',
      render: (title: string) => <span className="font-medium">{title}</span>,
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      render: (type: number) => (
        <Tag color={getBusinessTypeColor(type)}>{getBusinessTypeLabel(type)}</Tag>
      ),
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
      render: (method: string) => (
        <Tag color={getRequestMethodColor(method)}>{method?.toUpperCase()}</Tag>
      ),
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
    },
    {
      title: '请求URL',
      dataIndex: 'operUrl',
      ellipsis: true,
      width: 240,
    },
    {
      title: '主机地址',
      dataIndex: 'operIp',
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
          <span className="flex items-center gap-1 text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            异常
          </span>
        ),
    },
    {
      title: '消耗时间',
      dataIndex: 'costTime',
      render: (costTime: number) => `${costTime} ms`,
    },
    {
      title: '操作时间',
      dataIndex: 'operTime',
    },
    {
      title: '方法名称',
      dataIndex: 'method',
      ellipsis: true,
      width: 280,
    },
    {
      title: '错误消息',
      dataIndex: 'errorMsg',
      ellipsis: true,
      width: 200,
      render: (msg: string | undefined) => msg || '-',
    },
  ]
}
