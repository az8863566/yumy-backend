import { useState, useMemo, useCallback } from 'react'
import { Button, Input, Select, Table, Form, Card, App, Modal } from 'antd'
import { Search, Plus } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import SearchArea from '@/components/SearchArea'
import { getRoleDetail } from '@/api/system/role'
import { useRolePageQuery, useRoleMutations } from './hooks'
import { getRoleColumns } from './columns'
import RoleModal, { type RoleFormValues } from './RoleModal'
import type { SysRoleVO, SysRoleQueryDTO, SysRoleCreateDTO, SysRoleUpdateDTO } from '@/types'

export default function SystemRolePage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm()

  const { data, isLoading, pagination, setPagination, setSearchParams, refreshList } = useRolePageQuery()
  const { deleteMut, updateMut, createMut } = useRoleMutations()

  const [modalOpen, setModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [modalInitialValues, setModalInitialValues] = useState<RoleFormValues>({})
  const [modalLoading, setModalLoading] = useState(false)

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const params: Partial<SysRoleQueryDTO> = {}
    if (values.status !== undefined && values.status !== '') params.status = Number(values.status)
    if (values.roleName) params.roleName = values.roleName
    if (values.roleCode) params.roleCode = values.roleCode
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchParams({})
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleDelete = useCallback(
    (roleId: string) => {
      Modal.confirm({
        title: '确认删除',
        content: '删除后该角色数据将无法恢复，是否确认删除？',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteMut.mutateAsync(roleId)
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
    async (record: SysRoleVO) => {
      setIsEdit(true)
      setEditingRoleId(record.roleId)
      setModalOpen(true)
      setModalLoading(true)
      try {
        const detail = await getRoleDetail(record.roleId)
        setModalInitialValues({
          roleName: detail.roleName,
          roleCode: detail.roleCode,
          status: detail.status,
          remark: detail.remark,
        })
      } catch {
        message.warning('详情加载失败，已使用列表数据回显')
        setModalInitialValues({
          roleName: record.roleName,
          roleCode: record.roleCode,
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
    setEditingRoleId(null)
    setModalInitialValues({ status: 1 })
    setModalOpen(true)
  }

  const handleModalOk = async (values: RoleFormValues) => {
    try {
      if (isEdit && editingRoleId) {
        const payload: SysRoleUpdateDTO = {
          roleId: editingRoleId,
          roleName: values.roleName!,
          roleCode: values.roleCode!,
          status: values.status,
          remark: values.remark,
        }
        await updateMut.mutateAsync(payload)
        message.success('更新成功')
      } else {
        const payload: SysRoleCreateDTO = {
          roleName: values.roleName!,
          roleCode: values.roleCode!,
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

  const columns = useMemo(() => getRoleColumns({ onEdit: openEdit, onDelete: handleDelete }), [openEdit, handleDelete])

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
          <Form.Item name="status" label="角色状态">
            <Select
              placeholder="全部"
              className="w-full"
              allowClear
              options={[
                { label: '正常', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </Form.Item>
          <Form.Item name="roleName" label="角色名称">
            <Input placeholder="请输入角色名称" prefix={<Search size={14} />} allowClear />
          </Form.Item>
          <Form.Item name="roleCode" label="角色编码">
            <Input placeholder="请输入角色编码" prefix={<Search size={14} />} allowClear />
          </Form.Item>
        </SearchArea>
      </Card>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <span className="text-base font-semibold text-slate-800">角色列表</span>
          </div>
          <Button type="primary" icon={<Plus size={14} />} onClick={openCreate} className="rounded-lg h-9 px-4 shadow-sm">
            新增角色
          </Button>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data?.records || []}
            rowKey="roleId"
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

      <RoleModal
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
