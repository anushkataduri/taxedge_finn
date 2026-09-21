import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffCustomers = lazy(() => import('./pages/StaffCustomers/StaffCustomers'))

export const staffCustomersRoutes: RouteObject[] = [
  { path: routePaths.staff.customers, element: <StaffCustomers /> },
]
