import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffApplications = lazy(() => import('./pages/StaffApplications/StaffApplications'))
const StaffApplicationDetail = lazy(() => import('./pages/StaffApplicationDetail/StaffApplicationDetail'))

export const staffApplicationsRoutes: RouteObject[] = [
  { path: routePaths.staff.applications, element: <StaffApplications /> },
  { path: routePaths.staff.applicationDetail(), element: <StaffApplicationDetail /> },
]
