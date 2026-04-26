import { useEffect } from 'react'
import { Modal, Form, Input, Select, InputNumber } from 'antd'

export interface DictDataFormValues {
  dictSort?: number
  dictLabel?: string
  dictValue?: string
  dictType?: string
  cssClass?: string
  listClass?: string
  isDefault?: number
  status?: number
  remark?: string
}

interface DictDataModalProps {
  open: boolean
  isEdit: boolean
  initialValues: DictDataFormValues
  confirmLoading: boolean
  currentDictType?: string
  onOk: (values: DictDataFormValues) => void
  onCancel: () => void
}

export default function DictDataModal({
  open,
  isEdit,
  initialValues,
  confirmLoading,
  currentDictType,
  onOk,
  onCancel,
}: DictDataModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.resetFields()
      const values: DictDataFormValues = { ...initialValues }
      if (!isEdit && currentDictType) {
        values.dictType = currentDictType
      }
      form.setFieldsValue(values)
    }
  }, [open, initialValues, currentDictType, isEdit, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    onOk(values as DictDataFormValues)
  }

  return (
    <Modal
      title={isEdit ? '编辑字典数据' : '新增字典数据'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="dictLabel" label="字典标签" rules={[{ required: true, message: '请输入字典标签' }]}>
          <Input placeholder="请输入字典标签" />
        </Form.Item>
        <Form.Item name="dictValue" label="字典键值" rules={[{ required: true, message: '请输入字典键值' }]}>
          <Input placeholder="请输入字典键值" />
        </Form.Item>
        <Form.Item name="dictType" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="dictSort" label="字典排序">
          <InputNumber className="w-full" placeholder="请输入字典排序" min={0} />
        </Form.Item>
        <Form.Item name="listClass" label="表格回显样式">
          <Select
            placeholder="请选择回显样式"
            allowClear
            options={[
              { label: '默认', value: 'default' },
              { label: '主要', value: 'primary' },
              { label: '成功', value: 'success' },
              { label: '信息', value: 'info' },
              { label: '警告', value: 'warning' },
              { label: '危险', value: 'danger' },
            ]}
          />
        </Form.Item>
        <Form.Item name="cssClass" label="样式属性">
          <Input placeholder="请输入样式属性" />
        </Form.Item>
        <Form.Item name="isDefault" label="是否默认">
          <Select
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ]}
          />
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
