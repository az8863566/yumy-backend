import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'

export interface UserFormValues {
  username?: string
  nickname?: string
  password?: string
  email?: string
  phone?: string
  status?: number
  remark?: string
  roleIds?: string[]
}

interface UserModalProps {
  open: boolean
  isEdit: boolean
  initialValues: UserFormValues
  roleOptions: { label: string; value: string }[]
  roleLoading?: boolean
  confirmLoading: boolean
  onOk: (values: UserFormValues) => void
  onCancel: () => void
}

export default function UserModal({
  open,
  isEdit,
  initialValues,
  roleOptions,
  roleLoading,
  confirmLoading,
  onOk,
  onCancel,
}: UserModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue(initialValues)
    }
  }, [open, initialValues, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    onOk(values as UserFormValues)
  }

  return (
    <Modal
      title={isEdit ? '编辑用户' : '新增用户'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名" disabled={isEdit} />
        </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
          <Input placeholder="请输入昵称" />
        </Form.Item>
        {!isEdit && (
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}
        <Form.Item name="email" label="邮箱">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item name="phone" label="手机号">
          <Input placeholder="请输入手机号" />
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
        <Form.Item name="roleIds" label="所属角色">
          <Select
            mode="multiple"
            placeholder="请选择角色"
            options={roleOptions}
            loading={roleLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
