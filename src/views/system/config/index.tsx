import { useState, useMemo, useCallback } from 'react'
import { Button, Input, Select, Table, Form, Card, App, Modal } from 'antd'
import { Search, Plus } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import SearchArea from '@/components/SearchArea'
import { getConfigDetail } from '@/api/system/config'
import { useConfigPageQuery, useConfigMutations } from './hooks'
import { getConfigColumns } from './columns'
import ConfigModal, { type ConfigFormValues } from './ConfigModal'
import type { SysConfigVO, SysConfigQueryDTO, SysConfigCreateDTO, SysConfigUpdateDTO } from '@/types'

export default function SystemConfigPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm()

  const { data, isLoading, pagination, setPagination, setSearchParams, refreshList } = useConfigPageQuery()
  const { deleteMut, updateMut, createMut } = useConfigMutations()

  const [modalOpen, setModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingConfigId, setEditingConfigId] = useState<number | null>(null)
  const [modalInitialValues, setModalInitialValues] = useState<ConfigFormValues>({})
  const [modalLoading, setModalLoading] = useState(false)

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const params: Partial<SysConfigQueryDTO> = {}
    if (values.configName) params.configName = values.configName
    if (values.configKey) params.configKey = values.configKey
    if (values.configType !== undefined && values.configType !== '') params.configType = Number(values.configType)
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchParams({})
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleDelete = useCallback(
    (configId: number) => {
      Modal.confirm({
        title: '确认删除',
        content: '删除后该参数配置将无法恢复，是否确认删除？',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteMut.mutateAsync(configId)
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
    async (record: SysConfigVO) => {
      setIsEdit(true)
      setEditingConfigId(record.configId)
      setModalOpen(true)
      setModalLoading(true)
      try {
        const detail = await getConfigDetail(record.configId)
        setModalInitialValues({
          configName: detail.configName,
          configKey: detail.configKey,
          configValue: detail.configValue,
          configType: detail.configType,
          remark: detail.remark,
        })
      } catch {
        message.warning('详情加载失败，已使用列表数据回显')
        setModalInitialValues({
          configName: record.configName,
          configKey: record.configKey,
          configValue: record.configValue,
          configType: record.configType,
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
    setEditingConfigId(null)
    setModalInitialValues({ configType: 2 })
    setModalOpen(true)
  }

  const handleModalOk = async (values: ConfigFormValues) => {
    try {
      if (isEdit && editingConfigId) {
        const payload: SysConfigUpdateDTO = {
          configId: editingConfigId,
          configName: values.configName!,
          configKey: values.configKey!,
          configValue: values.configValue,
          configType: values.configType,
          remark: values.remark,
        }
        await updateMut.mutateAsync(payload)
        message.success('更新成功')
      } else {
        const payload: SysConfigCreateDTO = {
          configName: values.configName!,
          configKey: values.configKey!,
          configValue: values.configValue,
          configType: values.configType,
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

  const columns = useMemo(() => getConfigColumns({ onEdit: openEdit, onDelete: handleDelete }), [openEdit, handleDelete])

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
          <Form.Item name="configName" label="参数名称">
            <Input placeholder="请输入参数名称" prefix={<Search size={14} />} allowClear />
          </Form.Item>
          <Form.Item name="configKey" label="参数键名">
            <Input placeholder="请输入参数键名" prefix={<Search size={14} />} allowClear />
          </Form.Item>
          <Form.Item name="configType" label="系统内置">
            <Select
              placeholder="全部"
              className="w-full"
              allowClear
              options={[
                { label: '是', value: 1 },
                { label: '否', value: 2 },
              ]}
            />
          </Form.Item>
        </SearchArea>
      </Card>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <span className="text-base font-semibold text-slate-800">参数配置列表</span>
          </div>
          <Button type="primary" icon={<Plus size={14} />} onClick={openCreate} className="rounded-lg h-9 px-4 shadow-sm">
            新增参数
          </Button>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data?.records || []}
            rowKey="configId"
            loading={isLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: data?.total || 0,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`,
              onChange: (current, pageSize) => setPagination({ current, pageSize }),
            }}
          />
        </div>
      </div>

      <ConfigModal
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
