import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'

export interface RoleFormValues {
  roleName?: string
  roleCode?: string
  status?: number
  remark?: string
}

interface RoleModalProps {
  open: boolean
  isEdit: boolean
  initialValues: RoleFormValues
  confirmLoading: boolean
  onOk: (values: RoleFormValues) => void
  onCancel: () => void
}

export default function RoleModal({
  open,
  isEdit,
  initialValues,
  confirmLoading,
  onOk,
  onCancel,
}: RoleModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue(initialValues)
    }
  }, [open, initialValues, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    onOk(values as RoleFormValues)
  }

  return (
    <Modal
      title={isEdit ? '编辑角色' : '新增角色'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item name="roleCode" label="角色编码" rules={[{ required: true, message: '请输入角色编码' }]}>
          <Input placeholder="请输入角色编码" disabled={isEdit} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            options={[
              { label: '正常', value: 1 },
              { label: '禁用', value: 0 },
            ]}
          />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea placeholder="请输入备注" rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
