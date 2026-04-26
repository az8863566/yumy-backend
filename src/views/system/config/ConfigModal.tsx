import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'

export interface ConfigFormValues {
  configName?: string
  configKey?: string
  configValue?: string
  configType?: number
  remark?: string
}

interface ConfigModalProps {
  open: boolean
  isEdit: boolean
  initialValues: ConfigFormValues
  confirmLoading: boolean
  onOk: (values: ConfigFormValues) => void
  onCancel: () => void
}

export default function ConfigModal({
  open,
  isEdit,
  initialValues,
  confirmLoading,
  onOk,
  onCancel,
}: ConfigModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue(initialValues)
    }
  }, [open, initialValues, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    onOk(values as ConfigFormValues)
  }

  return (
    <Modal
      title={isEdit ? '编辑参数配置' : '新增参数配置'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="configName" label="参数名称" rules={[{ required: true, message: '请输入参数名称' }]}>
          <Input placeholder="请输入参数名称" maxLength={128} showCount />
        </Form.Item>
        <Form.Item name="configKey" label="参数键名" rules={[{ required: true, message: '请输入参数键名' }]}>
          <Input placeholder="请输入参数键名" maxLength={128} showCount />
        </Form.Item>
        <Form.Item name="configValue" label="参数键值">
          <Input placeholder="请输入参数键值" />
        </Form.Item>
        <Form.Item name="configType" label="系统内置" rules={[{ required: true, message: '请选择系统内置' }]}>
          <Select
            placeholder="请选择"
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 2 },
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
