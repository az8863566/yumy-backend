import { createBrowserRouter, Navigate } from 'react-router'
import AuthGuard from '@/components/AuthGuard'
import AppLayout from '@/layouts/AppLayout'
import LoginPage from '@/views/login'
import SystemUserPage from '@/views/system/user'
import SystemRolePage from '@/views/system/role'
import SystemMenuPage from '@/views/system/menu'
import SystemLogPage from '@/views/system/log'
import SystemDictPage from '@/views/system/dict'
import SystemConfigPage from '@/views/system/config'
import TocCategoryPage from '@/views/toc/category'
import TocRecipePage from '@/views/toc/recipe'
import TocUserPage from '@/views/toc/user'
import TocReviewPage from '@/views/toc/review'
import TocCarouselPage from '@/views/toc/carousel'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/system/user" replace /> },
      { path: 'system/user', element: <SystemUserPage /> },
      { path: 'system/role', element: <SystemRolePage /> },
      { path: 'system/menu', element: <SystemMenuPage /> },
      { path: 'system/log', element: <SystemLogPage /> },
      { path: 'system/dict', element: <SystemDictPage /> },
      { path: 'system/config', element: <SystemConfigPage /> },
      { path: 'toc/category', element: <TocCategoryPage /> },
      { path: 'toc/recipe', element: <TocRecipePage /> },
      { path: 'toc/user', element: <TocUserPage /> },
      { path: 'toc/review', element: <TocReviewPage /> },
      { path: 'toc/carousel', element: <TocCarouselPage /> },
    ],
  },
])
