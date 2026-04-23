import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Table, Space, Tag, App } from 'antd'
import { Trash2 } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getLogPage, deleteLog } from '@/api/system/log'
import type { SysLogVO } from '@/api/system/log'

export default function SystemLogPage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ['log', 'page', pagination],
    queryFn: () => getLogPage({ pageNum: pagination.current, pageSize: pagination.pageSize }),
  })

  const deleteMut = useMutation({ mutationFn: deleteLog })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['log', 'page'] })
  }

  const handleDelete = useCallback((logId: number) => {
    modal.confirm({
      title: '确认删除',
      content: '确认删除该日志？',
      onOk: async () => {
        await deleteMut.mutateAsync(logId)
        message.success('删除成功')
        refreshList()
      },
    })
  }, [modal, deleteMut, message, refreshList])

  const columns = useMemo(() => [
    { title: '操作内容', dataIndex: 'action' },
    { title: '操作人员', dataIndex: 'operator' },
    { title: 'IP地址', dataIndex: 'ip' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => (status === 'success' ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag>),
    },
    { title: '操作时间', dataIndex: 'time' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: SysLogVO) => (
        <Space>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => handleDelete(record.logId)}>删除</Button>
        </Space>
      ),
    },
  ], [handleDelete])

  return (
    <PageContainer>
      <Table
        columns={columns}
        dataSource={data?.records || []}
        rowKey="logId"
        loading={isLoading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
      />
    </PageContainer>
  )
}
