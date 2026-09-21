import { Navigate, Outlet } from 'react-router-dom'

import { roleHasPermission } from '@core/auth'
import type { Permission } from '@core/auth'
import { routePaths } from '@core/config'
import { useAuthStore } from '@store/index'

export interface PermissionRouteProps {
  permission: Permission
}

/**
 * Per-area gate inside the staff module. The staff-vs-customer decision
 * happens one level up in app/router/StaffRoute.
 */
export const PermissionRoute = ({ permission }: PermissionRouteProps) => {
  const user = useAuthStore((state) => state.user)

  if (!user) return null
  if (!roleHasPermission(user.role, permission)) {
    return <Navigate to={routePaths.staff.dashboard} replace />
  }

  return <Outlet />
}
