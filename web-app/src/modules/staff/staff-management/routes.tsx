import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffManagement = lazy(() => import('./pages/StaffManagement/StaffManagement'))

export const staffManagementRoutes: RouteObject[] = [
  { path: routePaths.staff.staffManagement, element: <StaffManagement /> },
]
