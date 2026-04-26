import { useState, useMemo, useCallback } from 'react'
import { Button, Input, Select, Table, Form, Card, App, Modal } from 'antd'
import { Search, Plus } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import SearchArea from '@/components/SearchArea'
import { getSysUserDetail } from '@/api/system/user'
import { useUserPageQuery, useRoleOptions, useUserMutations } from './hooks'
import { getUserColumns } from './columns'
import UserModal, { type UserFormValues } from './UserModal'
import type { SysUserVO, SysUserQueryDTO, SysUserCreateDTO, SysUserUpdateDTO } from '@/types'

export default function SystemUserPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm()

  const { data, isLoading, pagination, setPagination, setSearchParams, refreshList } = useUserPageQuery()
  const { roleData, formRoleOptions, searchRoleOptions } = useRoleOptions()
  const { deleteMut, updateMut, createMut } = useUserMutations()

  const [modalOpen, setModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [modalInitialValues, setModalInitialValues] = useState<UserFormValues>({})
  const [modalLoading, setModalLoading] = useState(false)

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const params: Partial<SysUserQueryDTO> = {}
    if (values.status !== undefined && values.status !== '') params.status = Number(values.status)
    if (values.roleId) params.roleId = values.roleId
    if (values.username) params.username = values.username
    if (values.nickname) params.nickname = values.nickname
    if (values.phone) params.phone = values.phone
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchParams({})
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleDelete = useCallback(
    (userId: string) => {
      Modal.confirm({
        title: '确认删除',
        content: '删除后该用户数据将无法恢复，是否确认删除？',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteMut.mutateAsync(userId)
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
    async (record: SysUserVO) => {
      setIsEdit(true)
      setEditingUserId(record.userId)
      setModalOpen(true)
      setModalLoading(true)
      try {
        const detail = await getSysUserDetail(record.userId)
        const roleIds =
          detail.roleIds ||
          (detail as unknown as { roles?: { roleId: string }[] }).roles?.map((r) => r.roleId) ||
          []
        setModalInitialValues({
          username: detail.username,
          nickname: detail.nickname,
          email: detail.email,
          phone: detail.phone,
          status: detail.status,
          remark: detail.remark,
          roleIds,
        })
      } catch {
        message.warning('详情加载失败，已使用列表数据回显')
        setModalInitialValues({
          username: record.username,
          nickname: record.nickname,
          email: record.email,
          phone: record.phone,
          status: record.status,
          remark: record.remark,
          roleIds: record.roleIds || [],
        })
      } finally {
        setModalLoading(false)
      }
    },
    [message],
  )

  const openCreate = () => {
    setIsEdit(false)
    setEditingUserId(null)
    setModalInitialValues({ status: 1, roleIds: [] })
    setModalOpen(true)
  }

  const handleModalOk = async (values: UserFormValues) => {
    try {
      if (isEdit && editingUserId) {
        const payload: SysUserUpdateDTO = {
          userId: editingUserId,
          nickname: values.nickname,
          email: values.email,
          phone: values.phone,
          status: values.status,
          remark: values.remark,
          roleIds: values.roleIds,
        }
        await updateMut.mutateAsync(payload)
        message.success('更新成功')
      } else {
        await createMut.mutateAsync(values as SysUserCreateDTO)
        message.success('新增成功')
      }
      setModalOpen(false)
      await refreshList()
    } catch {
      // 错误已在 request.ts 拦截器中提示
    }
  }

  const columns = useMemo(() => getUserColumns({ onEdit: openEdit, onDelete: handleDelete }), [openEdit, handleDelete])

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
          <Form.Item name="status" label="用户状态">
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
          <Form.Item name="roleId" label="所属角色">
            <Select placeholder="全部" className="w-full" allowClear options={searchRoleOptions} />
          </Form.Item>
          <Form.Item name="username" label="用户名">
            <Input placeholder="请输入用户名" prefix={<Search size={14} />} allowClear />
          </Form.Item>
          <Form.Item name="nickname" label="昵称">
            <Input placeholder="请输入昵称" prefix={<Search size={14} />} allowClear />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" prefix={<Search size={14} />} allowClear />
          </Form.Item>
        </SearchArea>
      </Card>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <span className="text-base font-semibold text-slate-800">用户列表</span>
          </div>
          <Button type="primary" icon={<Plus size={14} />} onClick={openCreate} className="rounded-lg h-9 px-4 shadow-sm">
            新增用户
          </Button>
        </div>
        <div className="p-6">
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
        </div>
      </div>

      <UserModal
        open={modalOpen}
        isEdit={isEdit}
        initialValues={modalInitialValues}
        roleOptions={formRoleOptions}
        roleLoading={!roleData}
        confirmLoading={updateMut.isPending || createMut.isPending || modalLoading}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      />
    </PageContainer>
  )
}
