import { useState, useMemo, useCallback } from 'react'
import { Button, Input, Select, Table, Form, Card, App, Modal } from 'antd'
import { Search, Plus } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import SearchArea from '@/components/SearchArea'
import { getMenuDetail } from '@/api/system/menu'
import { useMenuTreeQuery, useMenuMutations } from './hooks'
import { getMenuColumns } from './columns'
import MenuModal, { type MenuFormValues } from './MenuModal'
import type { SysMenuVO, SysMenuQueryDTO, SysMenuCreateDTO, SysMenuUpdateDTO } from '@/types'

export default function SystemMenuPage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm()

  const { data, isLoading, setSearchParams, refreshList } = useMenuTreeQuery()
  const { deleteMut, updateMut, createMut } = useMenuMutations()

  const [modalOpen, setModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null)
  const [modalInitialValues, setModalInitialValues] = useState<MenuFormValues>({})
  const [modalLoading, setModalLoading] = useState(false)

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const params: Partial<SysMenuQueryDTO> = {}
    if (values.menuName) params.menuName = values.menuName
    if (values.status !== undefined && values.status !== '') params.status = Number(values.status)
    setSearchParams(params)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchParams({})
  }

  const handleDelete = useCallback(
    (menuId: string) => {
      Modal.confirm({
        title: '确认删除',
        content: '删除后该菜单数据将无法恢复，是否确认删除？',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteMut.mutateAsync(menuId)
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
    async (record: SysMenuVO) => {
      setIsEdit(true)
      setEditingMenuId(record.menuId)
      setModalOpen(true)
      setModalLoading(true)
      try {
        const detail = await getMenuDetail(record.menuId)
        setModalInitialValues({
          parentId: detail.parentId,
          menuName: detail.menuName,
          menuType: detail.menuType,
          path: detail.path,
          component: detail.component,
          perms: detail.perms,
          icon: detail.icon,
          sortOrder: detail.sortOrder,
          visible: detail.visible,
          status: detail.status,
          remark: detail.remark,
        })
      } catch {
        message.warning('详情加载失败，已使用列表数据回显')
        setModalInitialValues({
          parentId: record.parentId,
          menuName: record.menuName,
          menuType: record.menuType,
          path: record.path,
          component: record.component,
          perms: record.perms,
          icon: record.icon,
          sortOrder: record.sortOrder,
          visible: record.visible,
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
    setEditingMenuId(null)
    setModalInitialValues({ status: 1, visible: 1, menuType: 2 })
    setModalOpen(true)
  }

  const handleModalOk = async (values: MenuFormValues) => {
    try {
      if (isEdit && editingMenuId) {
        const payload: SysMenuUpdateDTO = {
          menuId: editingMenuId,
          parentId: values.parentId,
          menuName: values.menuName!,
          menuType: values.menuType!,
          path: values.path,
          component: values.component,
          perms: values.perms,
          icon: values.icon,
          sortOrder: values.sortOrder,
          visible: values.visible,
          status: values.status,
          remark: values.remark,
        }
        await updateMut.mutateAsync(payload)
        message.success('更新成功')
      } else {
        const payload: SysMenuCreateDTO = {
          parentId: values.parentId,
          menuName: values.menuName!,
          menuType: values.menuType!,
          path: values.path,
          component: values.component,
          perms: values.perms,
          icon: values.icon,
          sortOrder: values.sortOrder,
          visible: values.visible,
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

  const columns = useMemo(() => getMenuColumns({ onEdit: openEdit, onDelete: handleDelete }), [openEdit, handleDelete])

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
          <Form.Item name="menuName" label="菜单名称">
            <Input placeholder="请输入菜单名称" prefix={<Search size={14} />} allowClear />
          </Form.Item>
          <Form.Item name="status" label="菜单状态">
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
        </SearchArea>
      </Card>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <span className="text-base font-semibold text-slate-800">菜单列表</span>
          </div>
          <Button type="primary" icon={<Plus size={14} />} onClick={openCreate} className="rounded-lg h-9 px-4 shadow-sm">
            新增菜单
          </Button>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data || []}
            rowKey="menuId"
            loading={isLoading}
            pagination={false}
            defaultExpandAllRows
          />
        </div>
      </div>

      <MenuModal
        open={modalOpen}
        isEdit={isEdit}
        initialValues={modalInitialValues}
        confirmLoading={updateMut.isPending || createMut.isPending || modalLoading}
        treeData={data || []}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      />
    </PageContainer>
  )
}
