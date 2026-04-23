import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Input, Select, Table, Tag, Space, Avatar, Form, Card, App } from 'antd'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getSysUserPage, deleteSysUser } from '@/api/system/user'
import type { SysUserVO, SysUserQueryDTO } from '@/types'

export default function SystemUserPage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ['sys-user', 'page', pagination],
    queryFn: () => {
      const params: SysUserQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }
      return getSysUserPage(params)
    },
  })

  const deleteMut = useMutation({ mutationFn: deleteSysUser })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['sys-user', 'page'] })
  }

  const handleDelete = (userId: number) => {
    modal.confirm({
      title: '确认删除',
      content: '确认删除该用户？',
      onOk: async () => {
        await deleteMut.mutateAsync(userId)
        message.success('删除成功')
        refreshList()
      },
    })
  }

  const columns = useMemo(() => [
    {
      title: '用户',
      dataIndex: 'nickname',
      render: (_: unknown, record: SysUserVO) => (
        <div className="flex items-center gap-3">
          <Avatar className="!bg-blue-500">{(record.nickname || record.username).charAt(0)}</Avatar>
          <div>
            <div className="font-medium">{record.nickname || record.username}</div>
            <div className="text-gray-400 text-sm">{record.email || '-'}</div>
          </div>
        </div>
      ),
    },
    {
      title: '所属角色',
      dataIndex: 'role',
      render: (role: string) => <Tag>{role || '-'}</Tag>,
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
          <Button type="link" icon={<Edit size={14} />}>编辑</Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => handleDelete(record.userId)}>删除</Button>
        </Space>
      ),
    },
  ], [handleDelete])

  return (
    <PageContainer>
      <Card className="mb-4">
        <Form form={form} layout="inline" className="flex flex-wrap gap-4">
          <Form.Item name="status" label="用户状态">
            <Select placeholder="全部" className="w-32" options={[
              { label: '全部', value: '' },
              { label: '正常', value: 'enabled' },
              { label: '禁用', value: 'disabled' },
            ]} />
          </Form.Item>
          <Form.Item name="role" label="所属角色">
            <Select placeholder="全部" className="w-32" options={[
              { label: '全部', value: '' },
              { label: 'ADMINISTRATOR', value: 'ADMINISTRATOR' },
              { label: 'EDITOR', value: 'EDITOR' },
              { label: 'VIEWER', value: 'VIEWER' },
            ]} />
          </Form.Item>
          <Form.Item name="keyword" label="搜索">
            <Input placeholder="搜索用户..." prefix={<Search size={14} />} className="w-48" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => form.resetFields()}>重置</Button>
              <Button type="primary" icon={<Plus size={14} />}>新增用户</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={data?.records || []}
        rowKey="userId"
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
