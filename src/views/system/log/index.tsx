import { useMemo } from 'react'
import { Table, Form, Card, Input, Select } from 'antd'
import { Search } from 'lucide-react'
import PageContainer from '@/components/PageContainer'
import SearchArea from '@/components/SearchArea'
import { useOperLogPageQuery } from './hooks'
import { getOperLogColumns } from './columns'
import type { SysOperLogQueryDTO } from '@/types'

export default function SystemLogPage() {
  const [searchForm] = Form.useForm()

  const { data, isLoading, pagination, setPagination, setSearchParams } = useOperLogPageQuery()

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const params: Partial<SysOperLogQueryDTO> = {}
    if (values.title) params.title = values.title
    if (values.businessType !== undefined && values.businessType !== '') {
      params.businessType = Number(values.businessType)
    }
    if (values.operName) params.operName = values.operName
    if (values.status !== undefined && values.status !== '') {
      params.status = Number(values.status)
    }
    setSearchParams(params)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchParams({})
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const columns = useMemo(() => getOperLogColumns(), [])

  return (
    <PageContainer>
      <Card className="mb-5 rounded-xl shadow-sm border-slate-100 overflow-hidden">
        <SearchArea
          form={searchForm}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={isLoading}
          defaultVisibleCount={3}
        >
          <Form.Item name="title" label="模块标题">
            <Input placeholder="请输入模块标题" prefix={<Search size={14} className="text-gray-400" />} allowClear />
          </Form.Item>
          <Form.Item name="businessType" label="业务类型">
            <Select placeholder="请选择业务类型" allowClear options={[
              { value: 1, label: '新增' },
              { value: 2, label: '修改' },
              { value: 3, label: '删除' },
              { value: 4, label: '导出' },
              { value: 5, label: '导入' },
              { value: 6, label: '查询' },
              { value: 7, label: '登录' },
              { value: 8, label: '登出' },
            ]} />
          </Form.Item>
          <Form.Item name="operName" label="操作人员">
            <Input placeholder="请输入操作人员" prefix={<Search size={14} className="text-gray-400" />} allowClear />
          </Form.Item>
          <Form.Item name="status" label="操作状态">
            <Select placeholder="请选择操作状态" allowClear options={[
              { value: 1, label: '正常' },
              { value: 0, label: '异常' },
            ]} />
          </Form.Item>
        </SearchArea>
      </Card>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <span className="text-base font-semibold text-slate-800">操作日志列表</span>
          </div>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            dataSource={data?.records || []}
            rowKey="operId"
            loading={isLoading}
            scroll={{ x: 1200 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: data?.total || 0,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            }}
          />
        </div>
      </div>
    </PageContainer>
  )
}
