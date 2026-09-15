import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffServices = lazy(() => import('./pages/StaffServices/StaffServices'))

export const staffServicesRoutes: RouteObject[] = [
  { path: routePaths.staff.services, element: <StaffServices /> },
]
