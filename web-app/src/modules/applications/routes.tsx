import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const Applications = lazy(() => import('./pages/Applications/Applications'))

export const applicationsRoutes: RouteObject[] = [{ path: routePaths.applications, element: <Applications /> }]
