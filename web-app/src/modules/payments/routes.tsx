import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { routePaths } from '@core/config'

const Payments = lazy(() => import('./pages/Payments/Payments'))
const Receipt = lazy(() => import('./pages/Receipt/Receipt'))

export const paymentsRoutes: RouteObject[] = [
  { path: routePaths.payments, element: <Payments /> },
  { path: routePaths.paymentReceiptDirect, element: <Receipt /> },
  { path: routePaths.paymentReceipt(), element: <Receipt /> },
]
