import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Button, Input, Select, Table, Form, Card, App, Modal } from 'antd'
import { Search, Plus } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import SearchArea from '@/components/SearchArea'
import { getDictTypeDetail } from '@/api/system/dict'
import { useDictTypePageQuery, useDictTypeMutations } from './hooks'
import { getDictTypeColumns } from './columns'
import DictTypeModal, { type DictTypeFormValues } from './DictTypeModal'
import type { SysDictTypeVO, SysDictTypeQueryDTO, SysDictTypeCreateDTO, SysDictTypeUpdateDTO } from '@/types'

export default function SystemDictTypePage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [searchForm] = Form.useForm()

  const { data, isLoading, pagination, setPagination, setSearchParams, refreshList } = useDictTypePageQuery()
  const { deleteMut, updateMut, createMut } = useDictTypeMutations()

  const [modalOpen, setModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingDictId, setEditingDictId] = useState<string | null>(null)
  const [modalInitialValues, setModalInitialValues] = useState<DictTypeFormValues>({})
  const [modalLoading, setModalLoading] = useState(false)

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const params: Partial<SysDictTypeQueryDTO> = {}
    if (values.status !== undefined && values.status !== '') params.status = Number(values.status)
    if (values.dictName) params.dictName = values.dictName
    if (values.dictType) params.dictType = values.dictType
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchParams({})
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleDelete = useCallback(
    (dictId: string) => {
      Modal.confirm({
        title: '确认删除',
        content: '删除后该字典类型将无法恢复，是否确认删除？',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteMut.mutateAsync(dictId)
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
    async (record: SysDictTypeVO) => {
      setIsEdit(true)
      setEditingDictId(record.dictId)
      setModalOpen(true)
      setModalLoading(true)
      try {
        const detail = await getDictTypeDetail(record.dictId)
        setModalInitialValues({
          dictName: detail.dictName,
          dictType: detail.dictType,
          status: detail.status,
          remark: detail.remark,
        })
      } catch {
        message.warning('详情加载失败，已使用列表数据回显')
        setModalInitialValues({
          dictName: record.dictName,
          dictType: record.dictType,
          status: record.status,
          remark: record.remark,
        })
      } finally {
        setModalLoading(false)
      }
    },
    [message],
  )

  const openCreate = () => {
    setIsEdit(false)
    setEditingDictId(null)
    setModalInitialValues({ status: 1 })
    setModalOpen(true)
  }

  const handleModalOk = async (values: DictTypeFormValues) => {
    try {
      if (isEdit && editingDictId) {
        const payload: SysDictTypeUpdateDTO = {
          dictId: editingDictId,
          dictName: values.dictName!,
          dictType: values.dictType!,
          status: values.status,
          remark: values.remark,
        }
        await updateMut.mutateAsync(payload)
        message.success('更新成功')
      } else {
        const payload: SysDictTypeCreateDTO = {
          dictName: values.dictName!,
          dictType: values.dictType!,
          status: values.status,
          remark: values.remark,
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

  const handleViewData = useCallback(
    (record: SysDictTypeVO) => {
      navigate(`/system/dict-data?dictType=${encodeURIComponent(record.dictType)}`)
    },
    [navigate],
  )

  const columns = useMemo(
    () => getDictTypeColumns({ onEdit: openEdit, onDelete: handleDelete, onViewData: handleViewData }),
    [openEdit, handleDelete, handleViewData],
  )

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
          <Form.Item name="status" label="字典状态">
            <Select
              placeholder="全部"
              className="w-full"
              allowClear
              options={[
                { label: '正常', value: 1 },
                { label: '停用', value: 0 },
              ]}
            />
          </Form.Item>
          <Form.Item name="dictName" label="字典名称">
            <Input placeholder="请输入字典名称" prefix={<Search size={14} />} allowClear />
          </Form.Item>
          <Form.Item name="dictType" label="字典类型">
            <Input placeholder="请输入字典类型" prefix={<Search size={14} />} allowClear />
          </Form.Item>
        </SearchArea>
      </Card>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <span className="text-base font-semibold text-slate-800">字典类型列表</span>
          </div>
          <Button type="primary" icon={<Plus size={14} />} onClick={openCreate} className="rounded-lg h-9 px-4 shadow-sm">
            新增字典类型
          </Button>
        </div>
        <div className="p-6">
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
        </div>
      </div>

      <DictTypeModal
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
