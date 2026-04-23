import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Input, Table, Space, Tag, Avatar, App, Modal } from 'antd'
import { Search, Eye, Ban } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getTocUserPage, getTocUserDetail, updateTocUserStatus } from '@/api/toc/user'
import type { TocUserVO, TocUserQueryDTO, TocUserStatusDTO } from '@/types'

export default function TocUserPage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [detailRecord, setDetailRecord] = useState<TocUserVO | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['toc-user', 'page', searchKeyword, pagination],
    queryFn: () => {
      const params: TocUserQueryDTO = {
        username: searchKeyword || undefined,
        nickname: searchKeyword || undefined,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }
      return getTocUserPage(params)
    },
  })

  const statusMut = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: TocUserStatusDTO }) =>
      updateTocUserStatus(userId, data),
  })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['toc-user', 'page'] })
  }

  const handleViewDetail = useCallback(async (userId: number) => {
    const detail = await getTocUserDetail(userId)
    setDetailRecord(detail)
    setDetailOpen(true)
  }, [])

  const handleToggleStatus = useCallback((userId: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1
    const action = newStatus === 0 ? '禁用' : '启用'
    modal.confirm({
      title: `确认${action}`,
      content: `确定要${action}该用户吗？`,
      onOk: async () => {
        await statusMut.mutateAsync({ userId, data: { status: newStatus } })
        message.success(`${action}成功`)
        refreshList()
      },
    })
  }, [modal, statusMut, message, refreshList])

  const columns = useMemo(() => [
    {
      title: '用户',
      dataIndex: 'nickname',
      render: (_: unknown, record: TocUserVO) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size={40}>
            {(record.nickname || record.username)?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{record.nickname || record.username}</div>
            <div className="text-gray-400 text-xs">ID: {record.userId}</div>
          </div>
        </div>
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '签名',
      dataIndex: 'signature',
      width: 200,
      ellipsis: true,
      render: (s: string) => s || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">正常</Tag>
        ) : (
          <Tag color="red">禁用</Tag>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: unknown, record: TocUserVO) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => handleViewDetail(record.userId)}
          >
            查看详情
          </Button>
          <Button
            type="link"
            size="small"
            danger={record.status !== 0}
            icon={<Ban size={14} />}
            onClick={() => handleToggleStatus(record.userId, record.status ?? 1)}
          >
            {record.status === 0 ? '启用' : '禁用'}
          </Button>
        </Space>
      ),
    },
  ], [handleViewDetail, handleToggleStatus])

  return (
    <PageContainer title="用户管理">
      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="搜索昵称或用户名..."
          prefix={<Search size={14} className="text-gray-400" />}
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value)
            setPagination((prev) => ({ ...prev, current: 1 }))
          }}
          allowClear
          className="w-64"
        />
      </div>

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

      {/* 用户详情弹窗 */}
      <Modal
        title="用户详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
      >
        {detailRecord && (
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={detailRecord.avatar} size={64}>
                {(detailRecord.nickname || detailRecord.username)?.charAt(0)}
              </Avatar>
              <div>
                <div className="text-lg font-medium">{detailRecord.nickname || detailRecord.username}</div>
                <div className="text-gray-400">@{detailRecord.username}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">用户ID</div>
              <div>{detailRecord.userId}</div>
              <div className="text-gray-500">用户名</div>
              <div>{detailRecord.username}</div>
              <div className="text-gray-500">昵称</div>
              <div>{detailRecord.nickname || '-'}</div>
              <div className="text-gray-500">签名</div>
              <div>{detailRecord.signature || '-'}</div>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  )
}
