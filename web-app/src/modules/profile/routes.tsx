import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const Profile = lazy(() => import('./pages/Profile/Profile'))

export const profileRoutes: RouteObject[] = [{ path: routePaths.profile, element: <Profile /> }]
