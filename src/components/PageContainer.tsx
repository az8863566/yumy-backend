import { Card, Typography } from 'antd'
import type { ReactNode } from 'react'

interface PageContainerProps {
  title?: string
  children: ReactNode
  extra?: ReactNode
}

export default function PageContainer({ title, children, extra }: PageContainerProps) {
  return (
    <div className="p-6">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <Typography.Title level={4} className="!mb-0">
            {title}
          </Typography.Title>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <Card>{children}</Card>
    </div>
  )
}
