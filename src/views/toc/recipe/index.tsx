import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button, Input, Table, Space, Tag, Modal, Form, InputNumber,
  Select, App, Avatar, Switch,
} from 'antd'
import { Plus, Edit, Trash2, Star, Search } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getRecipePage, createRecipe, updateRecipe, deleteRecipe, setRecipeRecommend } from '@/api/toc/recipe'
import { getCategoryTree } from '@/api/toc/category'
import type { TocRecipeVO, TocRecipeQueryDTO, TocRecipeRecommendDTO, TocCategoryTreeVO } from '@/types'

export default function TocRecipePage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TocRecipeVO | null>(null)
  const [form] = Form.useForm()

  // 查询菜谱列表
  const { data, isLoading } = useQuery({
    queryKey: ['recipe', 'page', searchKeyword, pagination],
    queryFn: () => {
      const params: TocRecipeQueryDTO = {
        keyword: searchKeyword || undefined,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }
      return getRecipePage(params)
    },
  })

  // 查询分类树（用于表单下拉选择）
  const { data: categoryTree = [] } = useQuery({
    queryKey: ['category', 'tree'],
    queryFn: getCategoryTree,
  })

  // 构建子分类选项
  const subCategoryOptions = categoryTree.flatMap((parent: TocCategoryTreeVO) =>
    (parent.subCategories || []).map((sub) => ({
      label: `${parent.name} / ${sub.name}`,
      value: sub.categoryId,
    }))
  )

  const createMut = useMutation({ mutationFn: createRecipe })
  const updateMut = useMutation({ mutationFn: updateRecipe })
  const deleteMut = useMutation({ mutationFn: deleteRecipe })
  const recommendMut = useMutation({
    mutationFn: ({ recipeId, data }: { recipeId: string; data: TocRecipeRecommendDTO }) =>
      setRecipeRecommend(recipeId, data),
  })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['recipe', 'page'] })
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editingRecord?.recipeId) {
      await updateMut.mutateAsync({ recipeId: editingRecord.recipeId, ...values })
      message.success('修改成功')
    } else {
      await createMut.mutateAsync(values)
      message.success('发布成功')
    }
    setModalOpen(false)
    setEditingRecord(null)
    refreshList()
  }

  const handleDelete = useCallback((recipeId: string) => {
    modal.confirm({
      title: '确认删除',
      content: '确认删除该菜谱？此操作不可恢复。',
      onOk: async () => {
        await deleteMut.mutateAsync(recipeId)
        message.success('删除成功')
        refreshList()
      },
    })
  }, [modal, deleteMut, message, refreshList])

  const handleRecommend = useCallback(async (recipeId: string, recommended: boolean) => {
    await recommendMut.mutateAsync({ recipeId, data: { recommendSort: recommended ? 1 : 0 } })
    message.success(recommended ? '已设为推荐' : '已取消推荐')
    refreshList()
  }, [recommendMut, message, refreshList])

  const columns = useMemo(() => [
    {
      title: '菜谱',
      dataIndex: 'title',
      render: (title: string, record: TocRecipeVO) => (
        <div className="flex items-center gap-3">
          {record.image && <Avatar shape="square" size={48} src={record.image} />}
          <div>
            <div className="font-medium">{title}</div>
            {record.description && (
              <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{record.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      width: 80,
      render: (d: string) => d ? <Tag>{d}</Tag> : '-',
    },
    {
      title: '制作时间',
      dataIndex: 'time',
      width: 100,
      render: (t: string) => t || '-',
    },
    {
      title: '推荐',
      dataIndex: 'recommendSort',
      width: 100,
      render: (_: unknown, record: TocRecipeVO) => {
        const isRecommended = (record.recommendSort ?? 0) > 0
        return (
          <Space>
            <Switch
              size="small"
              checked={isRecommended}
              onChange={(checked) => handleRecommend(record.recipeId, checked)}
            />
            {isRecommended ? (
              <span className="text-amber-500 text-xs flex items-center gap-0.5">
                <Star size={12} className="fill-amber-400" /> 推荐中
              </span>
            ) : (
              <span className="text-gray-400 text-xs">设为推荐</span>
            )}
          </Space>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: TocRecipeVO) => (
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
            onClick={() => handleDelete(record.recipeId)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], [handleDelete, handleRecommend, form])

  return (
    <PageContainer
      title="菜谱管理"
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
          发布菜谱
        </Button>
      }
    >
      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="搜索标题或描述..."
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
        rowKey="recipeId"
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

      {/* 新增/编辑菜谱弹窗 */}
      <Modal
        title={editingRecord ? '编辑菜谱' : '发布菜谱'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); setEditingRecord(null) }}
        confirmLoading={createMut.isPending || updateMut.isPending}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item label="菜谱标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入菜谱标题" />
          </Form.Item>
          <Form.Item label="菜谱描述" name="description" rules={[{ required: true, message: '请输入描述' }]}>
            <Input.TextArea rows={3} placeholder="请输入菜谱描述" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="所属子分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
              <Select placeholder="请选择分类" options={subCategoryOptions} />
            </Form.Item>
            <Form.Item label="难度" name="difficulty" rules={[{ required: true, message: '请选择难度' }]}>
              <Select placeholder="请选择" options={[
                { label: '简单', value: '简单' },
                { label: '中等', value: '中等' },
                { label: '困难', value: '困难' },
              ]} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="制作时间" name="time" rules={[{ required: true, message: '请输入制作时间' }]}>
              <Input placeholder="如：30分钟" />
            </Form.Item>
            <Form.Item label="几人份" name="servings">
              <InputNumber min={1} className="w-full" placeholder="如：2" />
            </Form.Item>
          </div>
          <Form.Item label="封面图URL" name="image" rules={[{ required: true, message: '请输入封面图URL' }]}>
            <Input placeholder="请输入封面图URL" />
          </Form.Item>
          <Form.Item label="推荐排序" name="recommendSort" tooltip="0=不推荐，>0=推荐且越小越靠前">
            <InputNumber min={0} className="w-full" placeholder="0" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
