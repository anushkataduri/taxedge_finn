import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const Chat = lazy(() => import('./pages/Chat/Chat'))

export const chatRoutes: RouteObject[] = [{ path: routePaths.chat, element: <Chat /> }]
