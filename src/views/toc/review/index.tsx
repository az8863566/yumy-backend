import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Input, Table, Space, Avatar, Tag, App, Modal, Image } from 'antd'
import { Search, Trash2, Eye } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getCommentPage, getCommentDetail, deleteComment } from '@/api/toc/comment'
import type { TocCommentVO, TocCommentQueryDTO } from '@/types'

export default function TocReviewPage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [detailRecord, setDetailRecord] = useState<TocCommentVO | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['comment', 'page', searchKeyword, pagination],
    queryFn: () => {
      const params: TocCommentQueryDTO = {
        text: searchKeyword || undefined,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }
      return getCommentPage(params)
    },
  })

  const deleteMut = useMutation({ mutationFn: deleteComment })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['comment', 'page'] })
  }

  const handleViewDetail = useCallback(async (commentId: number) => {
    const detail = await getCommentDetail(commentId)
    setDetailRecord(detail)
    setDetailOpen(true)
  }, [])

  const handleDelete = useCallback((commentId: number) => {
    modal.confirm({
      title: '确认删除',
      content: '确认删除该评论？此操作不可恢复。',
      onOk: async () => {
        await deleteMut.mutateAsync(commentId)
        message.success('删除成功')
        refreshList()
      },
    })
  }, [modal, deleteMut, message, refreshList])

  const columns = useMemo(() => [
    {
      title: '评论内容',
      dataIndex: 'text',
      ellipsis: true,
      render: (text: string) => (
        <span className="line-clamp-2">{text}</span>
      ),
    },
    {
      title: '评论者',
      dataIndex: 'username',
      width: 160,
      render: (_: unknown, record: TocCommentVO) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.avatar} size={28}>
            {record.username?.charAt(0)}
          </Avatar>
          <span>{record.username}</span>
        </div>
      ),
    },
    {
      title: '关联菜谱ID',
      dataIndex: 'recipeId',
      width: 100,
      render: (id: number) => <Tag>{id}</Tag>,
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
      width: 170,
      render: (t: string) => t ? new Date(t).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: unknown, record: TocCommentVO) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => handleViewDetail(record.commentId)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(record.commentId)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], [handleViewDetail, handleDelete])

  return (
    <PageContainer title="评论管理">
      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="搜索评论内容..."
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
        rowKey="commentId"
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

      {/* 评论详情弹窗 */}
      <Modal
        title="评论详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={520}
      >
        {detailRecord && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <Avatar src={detailRecord.avatar} size={48}>
                {detailRecord.username?.charAt(0)}
              </Avatar>
              <div>
                <div className="font-medium">{detailRecord.username}</div>
                <div className="text-gray-400 text-xs">
                  {detailRecord.createTime
                    ? new Date(detailRecord.createTime).toLocaleString('zh-CN')
                    : '-'}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p>{detailRecord.text}</p>
            </div>
            {detailRecord.images && detailRecord.images.length > 0 && (
              <div>
                <div className="text-gray-500 text-sm mb-2">评论图片</div>
                <div className="flex gap-2 flex-wrap">
                  {detailRecord.images.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">评论ID</div>
              <div>{detailRecord.commentId}</div>
              <div className="text-gray-500">菜谱ID</div>
              <div>{detailRecord.recipeId}</div>
              <div className="text-gray-500">用户ID</div>
              <div>{detailRecord.userId}</div>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  )
}
