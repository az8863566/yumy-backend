import { Layout } from 'antd'
import { Outlet } from 'react-router'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

const { Content } = Layout

export default function AppLayout() {
  return (
    <Layout className="h-screen">
      <Sidebar />
      <Layout className="flex-1">
        <Header />
        <Content className="m-0 bg-[#f0f2f5] overflow-auto flex-1">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
