import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { isStaffRole } from '@core/auth'
import { routePaths } from '@core/config'
import { Loader } from '@shared/components'
import { useAuthStore } from '@store/index'

/** Customer-only routes. Staff are redirected to their own dashboard. */
export const CustomerRoute = () => {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping, user } = useAuthStore()

  if (isBootstrapping) return <Loader fullPage label="Checking your session" />

  if (!isAuthenticated || !user) {
    return <Navigate to={routePaths.auth.login} state={{ from: location.pathname }} replace />
  }

  if (isStaffRole(user.role)) return <Navigate to={routePaths.staff.dashboard} replace />

  return <Outlet />
}
