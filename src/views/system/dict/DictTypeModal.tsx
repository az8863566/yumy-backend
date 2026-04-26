import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'

export interface DictTypeFormValues {
  dictName?: string
  dictType?: string
  status?: number
  remark?: string
}

interface DictTypeModalProps {
  open: boolean
  isEdit: boolean
  initialValues: DictTypeFormValues
  confirmLoading: boolean
  onOk: (values: DictTypeFormValues) => void
  onCancel: () => void
}

export default function DictTypeModal({
  open,
  isEdit,
  initialValues,
  confirmLoading,
  onOk,
  onCancel,
}: DictTypeModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue(initialValues)
    }
  }, [open, initialValues, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    onOk(values as DictTypeFormValues)
  }

  return (
    <Modal
      title={isEdit ? '编辑字典类型' : '新增字典类型'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="dictName" label="字典名称" rules={[{ required: true, message: '请输入字典名称' }]}>
          <Input placeholder="请输入字典名称" />
        </Form.Item>
        <Form.Item name="dictType" label="字典类型" rules={[{ required: true, message: '请输入字典类型' }]}>
          <Input placeholder="请输入字典类型" disabled={isEdit} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            options={[
              { label: '正常', value: 1 },
              { label: '停用', value: 0 },
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
