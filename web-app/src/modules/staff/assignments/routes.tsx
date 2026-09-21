import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffAssignments = lazy(() => import('./pages/StaffAssignments/StaffAssignments'))

export const staffAssignmentsRoutes: RouteObject[] = [
  { path: routePaths.staff.assignments, element: <StaffAssignments /> },
]
