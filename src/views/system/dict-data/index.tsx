import { useState, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { Button, Input, Select, Table, Form, Card, App, Modal, Tag } from 'antd'
import { Search, Plus, ArrowLeft } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import SearchArea from '@/components/SearchArea'
import { getDictDataDetail } from '@/api/system/dictData'
import { useDictDataPageQuery, useDictDataMutations } from './hooks'
import { getDictDataColumns } from './columns'
import DictDataModal, { type DictDataFormValues } from './DictDataModal'
import type { SysDictDataVO, SysDictDataQueryDTO, SysDictDataCreateDTO, SysDictDataUpdateDTO } from '@/types'

export default function SystemDictDataPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [urlSearchParams] = useSearchParams()
  const [searchForm] = Form.useForm()

  const urlDictType = urlSearchParams.get('dictType') || undefined

  const { data, isLoading, setSearchParams, refreshList } = useDictDataPageQuery(urlDictType)
  const { deleteMut, updateMut, createMut } = useDictDataMutations()

  const [modalOpen, setModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingDictCode, setEditingDictCode] = useState<string | null>(null)
  const [modalInitialValues, setModalInitialValues] = useState<DictDataFormValues>({})
  const [modalLoading, setModalLoading] = useState(false)

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const params: Partial<SysDictDataQueryDTO> = {}
    if (values.status !== undefined && values.status !== '') params.status = Number(values.status)
    if (values.dictLabel) params.dictLabel = values.dictLabel
    setSearchParams(params)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchParams({ dictType: urlDictType })
  }

  const handleDelete = useCallback(
    (dictCode: string) => {
      Modal.confirm({
        title: '确认删除',
        content: '删除后该字典数据将无法恢复，是否确认删除？',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteMut.mutateAsync(dictCode)
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
    async (record: SysDictDataVO) => {
      setIsEdit(true)
      setEditingDictCode(record.dictCode)
      setModalOpen(true)
      setModalLoading(true)
      try {
        const detail = await getDictDataDetail(record.dictCode)
        setModalInitialValues({
          dictSort: detail.dictSort,
          dictLabel: detail.dictLabel,
          dictValue: detail.dictValue,
          dictType: detail.dictType,
          cssClass: detail.cssClass,
          listClass: detail.listClass,
          isDefault: detail.isDefault,
          status: detail.status,
          remark: detail.remark,
        })
      } catch {
        message.warning('详情加载失败，已使用列表数据回显')
        setModalInitialValues({
          dictSort: record.dictSort,
          dictLabel: record.dictLabel,
          dictValue: record.dictValue,
          dictType: record.dictType,
          cssClass: record.cssClass,
          listClass: record.listClass,
          isDefault: record.isDefault,
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
    setEditingDictCode(null)
    setModalInitialValues({ status: 1, isDefault: 0, dictType: urlDictType })
    setModalOpen(true)
  }

  const handleModalOk = async (values: DictDataFormValues) => {
    try {
      if (isEdit && editingDictCode) {
        const payload: SysDictDataUpdateDTO = {
          dictCode: editingDictCode,
          dictSort: values.dictSort,
          dictLabel: values.dictLabel!,
          dictValue: values.dictValue!,
          dictType: values.dictType!,
          cssClass: values.cssClass,
          listClass: values.listClass,
          isDefault: values.isDefault,
          status: values.status,
          remark: values.remark,
        }
        await updateMut.mutateAsync(payload)
        message.success('更新成功')
      } else {
        const payload: SysDictDataCreateDTO = {
          dictSort: values.dictSort,
          dictLabel: values.dictLabel!,
          dictValue: values.dictValue!,
          dictType: values.dictType || urlDictType!,
          cssClass: values.cssClass,
          listClass: values.listClass,
          isDefault: values.isDefault,
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

  const columns = useMemo(() => getDictDataColumns({ onEdit: openEdit, onDelete: handleDelete }), [openEdit, handleDelete])

  return (
    <PageContainer>
      <Card className="mb-5 rounded-xl shadow-sm border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <span className="text-base font-semibold text-slate-800">
              {urlDictType ? `${urlDictType} 的字典数据` : '字典数据列表'}
            </span>
          </div>
          <Button icon={<ArrowLeft size={14} />} onClick={() => navigate('/system/dict')} className="rounded-lg h-9 px-4">
            返回字典类型
          </Button>
        </div>
      </Card>

      <Card className="mb-5 rounded-xl shadow-sm border-slate-100 overflow-hidden">
        <SearchArea
          form={searchForm}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={isLoading}
          defaultVisibleCount={3}
        >
          <Form.Item name="status" label="数据状态">
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
          <Form.Item name="dictLabel" label="字典标签">
            <Input placeholder="请输入字典标签" prefix={<Search size={14} />} allowClear />
          </Form.Item>
        </SearchArea>
      </Card>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
          <span className="text-sm text-slate-500">
            共 <span className="font-semibold text-slate-800">{data?.total || 0}</span> 条记录
          </span>
          <Button type="primary" icon={<Plus size={14} />} onClick={openCreate} className="rounded-lg h-9 px-4 shadow-sm">
            新增字典数据
          </Button>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data?.records || []}
            rowKey="dictCode"
            loading={isLoading}
            pagination={false}
          />
        </div>
      </div>

      <DictDataModal
        open={modalOpen}
        isEdit={isEdit}
        initialValues={modalInitialValues}
        confirmLoading={updateMut.isPending || createMut.isPending || modalLoading}
        currentDictType={urlDictType}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      />
    </PageContainer>
  )
}
