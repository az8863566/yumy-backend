import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Table, Space, Tag, App } from 'antd'
import { Plus, Edit, Trash2 } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getDictPage, deleteDict } from '@/api/system/dict'
import type { SysDictVO } from '@/api/system/dict'

export default function SystemDictPage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ['dict', 'page', pagination],
    queryFn: () => getDictPage({ pageNum: pagination.current, pageSize: pagination.pageSize }),
  })

  const deleteMut = useMutation({ mutationFn: deleteDict })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['dict', 'page'] })
  }

  const handleDelete = useCallback((dictId: number) => {
    modal.confirm({
      title: '确认删除',
      content: '确认删除该字典？',
      onOk: async () => {
        await deleteMut.mutateAsync(dictId)
        message.success('删除成功')
        refreshList()
      },
    })
  }, [modal, deleteMut, message, refreshList])

  const columns = useMemo(() => [
    { title: '字典名称', dataIndex: 'name' },
    { title: '字典编码', dataIndex: 'code', render: (code: string) => <Tag>{code}</Tag> },
    { title: '字典项', dataIndex: 'items' },
    { title: '创建时间', dataIndex: 'createTime', render: (t: string) => t || '-' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: SysDictVO) => (
        <Space>
          <Button type="link" icon={<Edit size={14} />}>编辑</Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => handleDelete(record.dictId)}>删除</Button>
        </Space>
      ),
    },
  ], [handleDelete])

  return (
    <PageContainer>
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<Plus size={14} />}>新增字典</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.records || []}
        rowKey="dictId"
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
