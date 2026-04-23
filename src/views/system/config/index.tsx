import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Card, App } from 'antd'
import { Save } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import { getConfig, updateConfig } from '@/api/system/config'
import type { SysConfigVO } from '@/api/system/config'

export default function SystemConfigPage() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const [form] = Form.useForm()

  const { data: configData } = useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
  })

  const updateMut = useMutation({ mutationFn: updateConfig })

  useEffect(() => {
    if (configData) {
      form.setFieldsValue(configData)
    }
  }, [configData, form])

  const handleSave = async () => {
    const values = await form.validateFields()
    await updateMut.mutateAsync(values as SysConfigVO)
    message.success('保存成功')
    queryClient.invalidateQueries({ queryKey: ['config'] })
  }

  return (
    <PageContainer title="系统配置">
      <Card>
        <Form form={form} layout="vertical" className="max-w-xl">
          <Form.Item label="系统名称" name="siteName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="版权信息" name="copyright" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<Save size={14} />} loading={updateMut.isPending} onClick={handleSave}>
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}
