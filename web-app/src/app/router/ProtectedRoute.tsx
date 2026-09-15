import { Navigate, Outlet, useLocation } from 'react-router-dom'

import type { UserRole } from '@core/auth'
import { Loader } from '@shared/components'
import { useAuthStore } from '@store/index'

import { routePaths } from '@core/config'

export interface ProtectedRouteProps {
  roles?: UserRole[]
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping, user } = useAuthStore()

  if (isBootstrapping) return <Loader fullPage label="Checking your session" />

  if (!isAuthenticated) {
    return <Navigate to={routePaths.auth.register} state={{ from: location.pathname }} replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={routePaths.dashboard} replace />
  }

  return <Outlet />
}
