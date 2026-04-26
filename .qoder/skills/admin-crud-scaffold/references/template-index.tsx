import { useState, useMemo, useCallback } from 'react'
import { Button, Input, Select, Table, Form, Card, App, Modal } from 'antd'
import { Search, Plus } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import SearchArea from '@/components/SearchArea'
import { getXxxDetail } from '@/api/{system|toc}/xxx'
import { useXxxPageQuery, useXxxMutations } from './hooks'
import { getXxxColumns } from './columns'
import XxxModal, { type XxxFormValues } from './XxxModal'
import type { SysXxxVO, SysXxxQueryDTO, SysXxxCreateDTO, SysXxxUpdateDTO } from '@/types'

export default function SystemXxxPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm()

  const { data, isLoading, pagination, setPagination, setSearchParams, refreshList } = useXxxPageQuery()
  const { deleteMut, updateMut, createMut } = useXxxMutations()

  const [modalOpen, setModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [modalInitialValues, setModalInitialValues] = useState<XxxFormValues>({})
  const [modalLoading, setModalLoading] = useState(false)

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const params: Partial<SysXxxQueryDTO> = {}
    if (values.status !== undefined && values.status !== '') params.status = Number(values.status)
    // ... 其他条件字段
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchParams({})
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: '确认删除',
        content: '删除后该数据将无法恢复，是否确认删除？',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteMut.mutateAsync(id)
            message.success('删除成功')
            await refreshList()
          } catch {
            // 错误已在 request.ts 拦截器中提示
          }
        },
      })
    },
    [deleteMut, message, refreshList],
  )

  const openEdit = useCallback(
    async (record: SysXxxVO) => {
      setIsEdit(true)
      setEditingId(record.id)
      setModalOpen(true)
      setModalLoading(true)
      try {
        const detail = await getXxxDetail(record.id)
        setModalInitialValues({
          // ... 按字段回显
        })
      } catch {
        message.warning('详情加载失败，已使用列表数据回显')
        setModalInitialValues({
          // ... 用 record 兜底
        })
      } finally {
        setModalLoading(false)
      }
    },
    [message],
  )

  const openCreate = () => {
    setIsEdit(false)
    setEditingId(null)
    setModalInitialValues({ status: 1 })
    setModalOpen(true)
  }

  const handleModalOk = async (values: XxxFormValues) => {
    try {
      if (isEdit && editingId) {
        const payload: SysXxxUpdateDTO = {
          id: editingId,
          // ...
        }
        await updateMut.mutateAsync(payload)
        message.success('更新成功')
      } else {
        const payload: SysXxxCreateDTO = {
          // ...
        }
        await createMut.mutateAsync(payload)
        message.success('新增成功')
      }
      setModalOpen(false)
      await refreshList()
    } catch {
      // 错误已在 request.ts 拦截器中提示
    }
  }

  const columns = useMemo(() => getXxxColumns({ onEdit: openEdit, onDelete: handleDelete }), [openEdit, handleDelete])

  return (
    <PageContainer>
      <Card className="mb-5 rounded-xl shadow-sm border-slate-100 overflow-hidden">
        <SearchArea
          form={searchForm}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={isLoading}
          defaultVisibleCount={3}
        >
          {/* 查询条件项 */}
        </SearchArea>
      </Card>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <span className="text-base font-semibold text-slate-800">XX列表</span>
          </div>
          <Button type="primary" icon={<Plus size={14} />} onClick={openCreate} className="rounded-lg h-9 px-4 shadow-sm">
            新增XX
          </Button>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data?.records || []}
            rowKey="id"
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
        </div>
      </div>

      <XxxModal
        open={modalOpen}
        isEdit={isEdit}
        initialValues={modalInitialValues}
        confirmLoading={updateMut.isPending || createMut.isPending || modalLoading}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      />
    </PageContainer>
  )
}
