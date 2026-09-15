import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffDashboard = lazy(() => import('./pages/StaffDashboard/StaffDashboard'))

export const staffDashboardRoutes: RouteObject[] = [
  { path: routePaths.staff.dashboard, element: <StaffDashboard /> },
]
