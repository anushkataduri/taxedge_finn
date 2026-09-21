import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffReports = lazy(() => import('./pages/StaffReports/StaffReports'))

export const staffReportsRoutes: RouteObject[] = [
  { path: routePaths.staff.reports, element: <StaffReports /> },
]
