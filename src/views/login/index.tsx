import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Form, Input, Card, Typography, message } from 'antd'
import { login } from '@/api/auth'
import { useUserStore } from '@/store/useUserStore'
import type { AuthLoginDTO } from '@/types'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setToken, setUserInfo } = useUserStore()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: AuthLoginDTO) => {
    setLoading(true)
    try {
      const data = await login(values)
      setToken(data.token)
      setUserInfo(data)
      message.success('登录成功')
      navigate('/')
    } catch (error: unknown) {
      let msg = '登录失败，请检查用户名和密码'
      if (error instanceof Error) {
        msg = error.message || msg
      }
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[420px] shadow-lg">
        <div className="text-center mb-8">
          <Typography.Title level={3} className="!mb-2">后羿管理系统</Typography.Title>
          <Typography.Text type="secondary">请登录以继续访问</Typography.Text>
        </div>

        <Form onFinish={handleSubmit} layout="vertical" initialValues={{ username: 'admin' }}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" size="large" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              登录系统
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-gray-400 text-sm mt-4">
          测试账号：admin, editor, guest（密码任意）
        </div>
      </Card>
    </div>
  )
}
