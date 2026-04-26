import { useEffect } from 'react'
import { Modal, Form, Input, Select, TreeSelect, InputNumber, Row, Col } from 'antd'
import type { SysMenuVO } from '@/types'

export interface MenuFormValues {
  parentId?: string
  menuName?: string
  menuType?: number
  path?: string
  component?: string
  perms?: string
  icon?: string
  sortOrder?: number
  visible?: number
  status?: number
  remark?: string
}

interface MenuModalProps {
  open: boolean
  isEdit: boolean
  initialValues: MenuFormValues
  confirmLoading: boolean
  treeData: SysMenuVO[]
  onOk: (values: MenuFormValues) => void
  onCancel: () => void
}

export default function MenuModal({
  open,
  isEdit,
  initialValues,
  confirmLoading,
  treeData,
  onOk,
  onCancel,
}: MenuModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue(initialValues)
    }
  }, [open, initialValues, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    onOk(values as MenuFormValues)
  }

  return (
    <Modal
      title={isEdit ? '编辑菜单' : '新增菜单'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnHidden
      width={640}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="parentId" label="上级菜单">
          <TreeSelect
            treeData={treeData}
            fieldNames={{ label: 'menuName', value: 'menuId', children: 'children' }}
            placeholder="请选择上级菜单（不选则为顶级菜单）"
            allowClear
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item name="menuName" label="菜单名称" rules={[{ required: true, message: '请输入菜单名称' }]}>
          <Input placeholder="请输入菜单名称" maxLength={64} showCount />
        </Form.Item>
        <Form.Item name="menuType" label="菜单类型" rules={[{ required: true, message: '请选择菜单类型' }]}>
          <Select
            placeholder="请选择菜单类型"
            options={[
              { label: '目录', value: 1 },
              { label: '菜单', value: 2 },
              { label: '按钮', value: 3 },
            ]}
          />
        </Form.Item>
        <Form.Item name="path" label="路由地址">
          <Input placeholder="请输入路由地址" />
        </Form.Item>
        <Form.Item name="component" label="组件路径">
          <Input placeholder="请输入组件路径" />
        </Form.Item>
        <Form.Item name="perms" label="权限标识">
          <Input placeholder="请输入权限标识，如 system:user:list" />
        </Form.Item>
        <Form.Item name="icon" label="菜单图标">
          <Input placeholder="请输入菜单图标" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="sortOrder" label="显示顺序">
              <InputNumber placeholder="请输入" className="w-full" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="visible" label="显示状态">
              <Select
                placeholder="请选择"
                options={[
                  { label: '显示', value: 1 },
                  { label: '隐藏', value: 0 },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="可用状态">
              <Select
                placeholder="请选择"
                options={[
                  { label: '正常', value: 1 },
                  { label: '停用', value: 0 },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="remark" label="备注">
          <Input.TextArea placeholder="请输入备注" rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
