import { Navigate, useLocation } from 'react-router'
import { useUserStore } from '@/store/useUserStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { userInfo } = useUserStore()
  const location = useLocation()

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
