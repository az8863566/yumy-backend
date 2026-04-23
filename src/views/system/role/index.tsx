import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Table, Space, Tag, App } from 'antd'
import { Plus, Edit, Trash2 } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getRolePage, deleteRole } from '@/api/system/role'
import type { SysRoleVO } from '@/api/system/role'

export default function SystemRolePage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ['role', 'page', pagination],
    queryFn: () => getRolePage({ pageNum: pagination.current, pageSize: pagination.pageSize }),
  })

  const deleteMut = useMutation({ mutationFn: deleteRole })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['role', 'page'] })
  }

  const handleDelete = useCallback((roleId: number) => {
    modal.confirm({
      title: '确认删除',
      content: '确认删除该角色？',
      onOk: async () => {
        await deleteMut.mutateAsync(roleId)
        message.success('删除成功')
        refreshList()
      },
    })
  }, [modal, deleteMut, message, refreshList])

  const columns = useMemo(() => [
    { title: '角色名称', dataIndex: 'name' },
    { title: '角色编码', dataIndex: 'code', render: (code: string) => <Tag>{code}</Tag> },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) => (status === 1 ? <Tag color="green">正常</Tag> : <Tag color="red">禁用</Tag>),
    },
    { title: '创建时间', dataIndex: 'createTime', render: (t: string) => t || '-' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: SysRoleVO) => (
        <Space>
          <Button type="link" icon={<Edit size={14} />}>编辑</Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => handleDelete(record.roleId)}>删除</Button>
        </Space>
      ),
    },
  ], [handleDelete])

  return (
    <PageContainer>
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<Plus size={14} />}>新增角色</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.records || []}
        rowKey="roleId"
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
