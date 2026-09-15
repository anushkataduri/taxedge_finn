import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const StaffDocuments = lazy(() => import('./pages/StaffDocuments/StaffDocuments'))

export const staffDocumentsRoutes: RouteObject[] = [
  { path: routePaths.staff.documents, element: <StaffDocuments /> },
]
