import { useState, useMemo } from 'react'
import { Button, Form, Row, Col, Popover } from 'antd'
import { Search, RotateCcw, ChevronDown, ChevronUp, SlidersHorizontal, Filter } from 'lucide-react'
import type { FormInstance } from 'antd/es/form'

interface SearchAreaProps {
  form: FormInstance
  onSearch: () => void
  onReset: () => void
  loading?: boolean
  children: React.ReactNode
  defaultVisibleCount?: number
}

export default function SearchArea({
  form,
  onSearch,
  onReset,
  loading,
  children,
  defaultVisibleCount = 3,
}: SearchAreaProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const allItems = useMemo(() => {
    const arr = Array.isArray(children) ? children : [children]
    return arr.filter(Boolean)
  }, [children])

  const visibleItems = allItems.slice(0, defaultVisibleCount)
  const hiddenItems = allItems.slice(defaultVisibleCount)
  const hasHidden = hiddenItems.length > 0

  const handleSearch = () => {
    setPopoverOpen(false)
    onSearch()
  }

  const handleReset = () => {
    setPopoverOpen(false)
    onReset()
  }

  const popoverContent = useMemo(() => (
    <div className="min-w-[360px]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-blue-500" />
          <span className="text-sm font-semibold text-slate-700">高级筛选</span>
        </div>
        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
          {hiddenItems.length} 项
        </span>
      </div>
      <Form form={form} layout="vertical" className="mb-0">
        <div className="space-y-3">
          {hiddenItems.map((item, index) => (
            <div key={`hidden-${index}`} className="w-full">
              {item}
            </div>
          ))}
        </div>
      </Form>
    </div>
  ), [hiddenItems, form])

  return (
    <div className="relative">
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 rounded-t-lg opacity-80" />

      <div className="pt-5">
        <Form form={form} className="mb-0">
          <Row gutter={[24, 20]}>
            {visibleItems.map((item, index) => (
              <Col key={`visible-${index}`} xs={24} sm={12} md={8} lg={6}>
                {item}
              </Col>
            ))}

            {hasHidden && (
              <Col xs={24} sm={12} md={8} lg={6} className="flex items-center">
                <Popover
                  open={popoverOpen}
                  onOpenChange={setPopoverOpen}
                  content={popoverContent}
                  trigger="click"
                  placement="bottomLeft"
                  arrow={{ pointAtCenter: true }}
                  overlayClassName="search-area-popover"
                >
                  <button
                    type="button"
                    className="group inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-500 hover:text-blue-600 bg-slate-50/80 hover:bg-blue-50 rounded-full transition-all duration-300 border border-slate-100 hover:border-blue-200 hover:shadow-sm"
                  >
                    <SlidersHorizontal size={14} />
                    <span>高级筛选</span>
                    {popoverOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </Popover>
              </Col>
            )}
          </Row>
        </Form>

        {/* 底部操作栏 */}
        <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button
            onClick={handleReset}
            icon={<RotateCcw size={14} />}
            className="rounded-lg h-9 px-4 border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 transition-colors"
          >
            重置
          </Button>
          <Button
            type="primary"
            onClick={handleSearch}
            loading={loading}
            icon={<Search size={14} />}
            className="rounded-lg h-9 px-5 shadow-sm hover:shadow-md transition-shadow"
          >
            查询
          </Button>
        </div>
      </div>
    </div>
  )
}
