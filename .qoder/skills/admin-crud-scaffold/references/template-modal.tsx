import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'

export interface XxxFormValues {
  name?: string
  status?: number
  remark?: string
}

interface XxxModalProps {
  open: boolean
  isEdit: boolean
  initialValues: XxxFormValues
  confirmLoading: boolean
  onOk: (values: XxxFormValues) => void
  onCancel: () => void
}

export default function XxxModal({
  open,
  isEdit,
  initialValues,
  confirmLoading,
  onOk,
  onCancel,
}: XxxModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue(initialValues)
    }
  }, [open, initialValues, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    onOk(values as XxxFormValues)
  }

  return (
    <Modal
      title={isEdit ? '编辑XX' : '新增XX'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入名称" />
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
