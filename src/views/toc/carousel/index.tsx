import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button, Table, Space, Tag, Modal, Form, Input, InputNumber,
  Select, App, Avatar, Alert,
} from 'antd'
import { Plus, Edit, Trash2 } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getBannerPage, createBanner, updateBanner, deleteBanner } from '@/api/toc/banner'
import type { TocBannerVO, TocBannerQueryDTO } from '@/types'

export default function TocCarouselPage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TocBannerVO | null>(null)
  const [form] = Form.useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['banner', 'page', pagination],
    queryFn: () => {
      const params: TocBannerQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }
      return getBannerPage(params)
    },
  })

  const createMut = useMutation({ mutationFn: createBanner })
  const updateMut = useMutation({ mutationFn: updateBanner })
  const deleteMut = useMutation({ mutationFn: deleteBanner })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['banner', 'page'] })
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editingRecord?.bannerId) {
      await updateMut.mutateAsync({ bannerId: editingRecord.bannerId, ...values })
      message.success('修改成功')
    } else {
      await createMut.mutateAsync(values)
      message.success('新增成功')
    }
    setModalOpen(false)
    setEditingRecord(null)
    refreshList()
  }

  const handleDelete = useCallback((bannerId: number) => {
    modal.confirm({
      title: '确认删除',
      content: '确认删除该轮播图？',
      onOk: async () => {
        await deleteMut.mutateAsync(bannerId)
        message.success('删除成功')
        refreshList()
      },
    })
  }, [modal, deleteMut, message, refreshList])

  const linkTypeMap: Record<number, string> = {
    0: '无跳转',
    1: '菜谱详情',
    2: '外部链接',
  }

  const columns = useMemo(() => [
    {
      title: '缩略图',
      dataIndex: 'image',
      width: 100,
      render: (url: string) => (
        <Avatar shape="square" size={64} src={url} />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (title: string, record: TocBannerVO) => (
        <div>
          <div className="font-medium">{title}</div>
          {record.subtitle && <div className="text-gray-400 text-xs">{record.subtitle}</div>}
        </div>
      ),
    },
    {
      title: '跳转类型',
      dataIndex: 'linkType',
      width: 100,
      render: (type: number) => <Tag>{linkTypeMap[type] || '未知'}</Tag>,
    },
    {
      title: '跳转目标',
      dataIndex: 'linkValue',
      width: 140,
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 80,
      render: (v: number) => v ?? '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">展示中</Tag>
        ) : (
          <Tag color="gray">已停用</Tag>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: unknown, record: TocBannerVO) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<Edit size={14} />}
            onClick={() => {
              setEditingRecord(record)
              form.setFieldsValue(record)
              setModalOpen(true)
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(record.bannerId)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], [handleDelete, form])

  return (
    <PageContainer
      title="轮播图管理"
      extra={
        <Button
          type="primary"
          icon={<Plus size={14} />}
          onClick={() => {
            setEditingRecord(null)
            form.resetFields()
            setModalOpen(true)
          }}
        >
          新增轮播
        </Button>
      }
    >
      <Alert
        message="推荐尺寸: 750x350, 格式: JPG/PNG"
        type="info"
        showIcon
        className="mb-4"
      />

      <Table
        columns={columns}
        dataSource={data?.records || []}
        rowKey="bannerId"
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

      {/* 新增/编辑轮播图弹窗 */}
      <Modal
        title={editingRecord ? '编辑轮播图' : '新增轮播图'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); setEditingRecord(null) }}
        confirmLoading={createMut.isPending || updateMut.isPending}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入轮播图标题" />
          </Form.Item>
          <Form.Item label="副标题" name="subtitle">
            <Input placeholder="请输入副标题/描述" />
          </Form.Item>
          <Form.Item label="图片URL" name="image" rules={[{ required: true, message: '请输入图片URL' }]}>
            <Input placeholder="请输入轮播图图片URL" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="跳转类型" name="linkType" initialValue={0}>
              <Select options={[
                { label: '无跳转', value: 0 },
                { label: '菜谱详情', value: 1 },
                { label: '外部链接', value: 2 },
              ]} />
            </Form.Item>
            <Form.Item label="排序" name="sortOrder" initialValue={0}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
          <Form.Item label="跳转目标" name="linkValue">
            <Input placeholder="菜谱ID或外部链接URL" />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1} rules={[{ required: true }]}>
            <Select options={[
              { label: '启用', value: 1 },
              { label: '停用', value: 0 },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
