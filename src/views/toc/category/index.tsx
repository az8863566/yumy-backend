import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Table, Space, Tag, Modal, Form, Input, InputNumber, App } from 'antd'
import { Plus, Edit, Trash2 } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import {
  getCategoryTree,
  createParentCategory,
  updateParentCategory,
  deleteParentCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '@/api/toc/category'
import { uploadFile } from '@/api/common'
import type { TocCategoryTreeVO, TocSubCategoryItemVO } from '@/types'

export default function TocCategoryPage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [parentModalOpen, setParentModalOpen] = useState(false)
  const [subModalOpen, setSubModalOpen] = useState(false)
  type CategoryEditingRecord =
    | { level: 'parent'; categoryId?: number; name: string; sortOrder: number }
    | { level: 'child'; categoryId?: number; parentId: number; name: string; image: string; sortOrder: number }

  const [editingRecord, setEditingRecord] = useState<CategoryEditingRecord | null>(null)
  const [parentForm] = Form.useForm()
  const [subForm] = Form.useForm()

  // 查询分类树
  const { data: treeData = [], isLoading } = useQuery({
    queryKey: ['category', 'tree'],
    queryFn: getCategoryTree,
  })

  // Mutations
  const createParentMut = useMutation({ mutationFn: createParentCategory })
  const updateParentMut = useMutation({ mutationFn: updateParentCategory })
  const deleteParentMut = useMutation({ mutationFn: deleteParentCategory })
  const createSubMut = useMutation({ mutationFn: createSubCategory })
  const updateSubMut = useMutation({ mutationFn: updateSubCategory })
  const deleteSubMut = useMutation({ mutationFn: deleteSubCategory })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['category', 'tree'] })
  }

  // 新增/编辑父分类
  const handleParentSubmit = async () => {
    const values = await parentForm.validateFields()
    if (editingRecord?.categoryId) {
      await updateParentMut.mutateAsync({ categoryId: editingRecord.categoryId as number, ...values })
      message.success('修改成功')
    } else {
      await createParentMut.mutateAsync(values)
      message.success('新增成功')
    }
    setParentModalOpen(false)
    setEditingRecord(null)
    refreshList()
  }

  // 新增/编辑子分类
  const handleSubSubmit = async () => {
    const values = await subForm.validateFields()
    if (editingRecord?.categoryId) {
      await updateSubMut.mutateAsync({ categoryId: editingRecord.categoryId as number, ...values })
      message.success('修改成功')
    } else {
      await createSubMut.mutateAsync(values)
      message.success('新增成功')
    }
    setSubModalOpen(false)
    setEditingRecord(null)
    refreshList()
  }

  const handleDelete = useCallback((type: 'parent' | 'sub', id: number) => {
    modal.confirm({
      title: '确认删除',
      content: type === 'parent' ? '删除父分类将同时删除其所有子分类，确认继续？' : '确认删除该子分类？',
      onOk: async () => {
        if (type === 'parent') {
          await deleteParentMut.mutateAsync(id)
        } else {
          await deleteSubMut.mutateAsync(id)
        }
        message.success('删除成功')
        refreshList()
      },
    })
  }, [modal, deleteParentMut, deleteSubMut, message, refreshList])

  // 将树形数据展开成表格行
  type TableRow = {
    key: string
    name: string
    level: 'parent' | 'child'
    sortOrder: number
    categoryId: number
    parentId?: number
    image?: string
    createTime?: string
  }

  const tableData: TableRow[] = treeData.flatMap((parent: TocCategoryTreeVO) => {
    const rows: TableRow[] = [
      {
        key: `p-${parent.categoryId}`,
        categoryId: parent.categoryId,
        name: parent.name,
        level: 'parent',
        sortOrder: parent.sortOrder,
        createTime: parent.createTime,
      },
    ]
    if (parent.subCategories) {
      parent.subCategories.forEach((sub: TocSubCategoryItemVO) => {
        rows.push({
          key: `s-${sub.categoryId}`,
          categoryId: sub.categoryId,
          parentId: sub.parentId,
          name: sub.name,
          level: 'child',
          sortOrder: sub.sortOrder,
          image: sub.image,
          createTime: sub.createTime,
        })
      })
    }
    return rows
  })

  const columns = useMemo(() => [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TableRow) =>
        record.level === 'child' ? (
          <span className="pl-6 text-gray-600">├─ {name}</span>
        ) : (
          <span className="font-medium">{name}</span>
        ),
    },
    {
      title: '层级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) =>
        level === 'parent' ? (
          <Tag color="blue">大分类</Tag>
        ) : (
          <Tag color="cyan">子分类</Tag>
        ),
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: TableRow) => (
        <Space>
          {record.level === 'parent' ? (
            <>
              <Button
                type="link"
                size="small"
                icon={<Edit size={14} />}
                onClick={() => {
                  setEditingRecord(record as CategoryEditingRecord)
                  parentForm.setFieldsValue(record)
                  setParentModalOpen(true)
                }}
              >
                编辑
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<Trash2 size={14} />}
                onClick={() => handleDelete('parent', record.categoryId)}
              >
                删除
              </Button>
            </>
          ) : (
            <>
              <Button
                type="link"
                size="small"
                icon={<Edit size={14} />}
                onClick={() => {
                  setEditingRecord(record as CategoryEditingRecord)
                  subForm.setFieldsValue(record)
                  setSubModalOpen(true)
                }}
              >
                编辑
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<Trash2 size={14} />}
                onClick={() => handleDelete('sub', record.categoryId)}
              >
                删除
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ], [handleDelete, parentForm, subForm])

  return (
    <PageContainer
      title="分类管理"
      extra={
        <Space>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            onClick={() => {
              setEditingRecord(null)
              parentForm.resetFields()
              setParentModalOpen(true)
            }}
          >
            新建父分类
          </Button>
          <Button
            icon={<Plus size={14} />}
            onClick={() => {
              setEditingRecord(null)
              subForm.resetFields()
              setSubModalOpen(true)
            }}
          >
            新建子分类
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={tableData}
        loading={isLoading}
        pagination={false}
        rowKey="key"
      />

      {/* 父分类弹窗 */}
      <Modal
        title={editingRecord ? '编辑父分类' : '新建父分类'}
        open={parentModalOpen}
        onOk={handleParentSubmit}
        onCancel={() => { setParentModalOpen(false); setEditingRecord(null) }}
        confirmLoading={createParentMut.isPending || updateParentMut.isPending}
      >
        <Form form={parentForm} layout="vertical" className="mt-4">
          <Form.Item label="分类名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder" initialValue={0}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 子分类弹窗 */}
      <Modal
        title={editingRecord ? '编辑子分类' : '新建子分类'}
        open={subModalOpen}
        onOk={handleSubSubmit}
        onCancel={() => { setSubModalOpen(false); setEditingRecord(null) }}
        confirmLoading={createSubMut.isPending || updateSubMut.isPending}
      >
        <Form form={subForm} layout="vertical" className="mt-4">
          <Form.Item label="父分类ID" name="parentId" rules={[{ required: true, message: '请输入父分类ID' }]}>
            <InputNumber className="w-full" placeholder="请输入父分类ID" />
          </Form.Item>
          <Form.Item label="子分类名称" name="name" rules={[{ required: true, message: '请输入子分类名称' }]}>
            <Input placeholder="请输入子分类名称" />
          </Form.Item>
          <Form.Item label="封面图URL" name="image" rules={[{ required: true, message: '请输入或上传封面图' }]}>
            <Input placeholder="请输入封面图URL" />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder" initialValue={0}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
