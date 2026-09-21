import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const Documents = lazy(() => import('./pages/Documents/Documents'))

export const documentsRoutes: RouteObject[] = [{ path: routePaths.documents, element: <Documents /> }]
