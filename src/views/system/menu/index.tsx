import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Table, Space, Tag, Card, App } from 'antd'
import { Plus, Edit, Trash2 } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getMenuTree, deleteMenu } from '@/api/system/menu'
import type { SysMenuVO } from '@/api/system/menu'

export default function SystemMenuPage() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])

  const { data: treeData = [], isLoading } = useQuery({
    queryKey: ['menu', 'tree'],
    queryFn: getMenuTree,
  })

  const deleteMut = useMutation({ mutationFn: deleteMenu })

  const refreshList = () => {
    queryClient.invalidateQueries({ queryKey: ['menu', 'tree'] })
  }

  const handleDelete = useCallback((menuId: number) => {
    modal.confirm({
      title: '确认删除',
      content: '确认删除该菜单？',
      onOk: async () => {
        await deleteMut.mutateAsync(menuId)
        message.success('删除成功')
        refreshList()
      },
    })
  }, [modal, deleteMut, message, refreshList])

  const columns = useMemo(() => [
    { title: '菜单名称', dataIndex: 'name', key: 'name' },
    { title: '图标配置', dataIndex: 'icon', key: 'icon', render: (icon: string) => <Tag>{icon || '-'}</Tag> },
    { title: '路由路径', dataIndex: 'path', key: 'path', render: (p: string) => p || '-' },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: SysMenuVO) => (
        <Space>
          <Button type="link" icon={<Edit size={14} />}>编辑</Button>
          <Button type="link" danger icon={<Trash2 size={14} />} onClick={() => handleDelete(record.menuId)}>删除</Button>
        </Space>
      ),
    },
  ], [handleDelete])

  return (
    <PageContainer>
      <Card className="mb-4">
        <div className="text-gray-500 text-sm">
          <div className="text-gray-400 mb-1">视图类型</div>
          <div>树形列表</div>
        </div>
      </Card>
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<Plus size={14} />}>新建菜单</Button>
      </div>
      <Table
        columns={columns}
        dataSource={treeData}
        rowKey="menuId"
        loading={isLoading}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
        }}
        defaultExpandAllRows
        pagination={false}
      />
    </PageContainer>
  )
}
