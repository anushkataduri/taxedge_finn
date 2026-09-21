import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { routePaths } from '@core/config'

const Itr = lazy(() => import('./pages/Itr/Itr'))
const FileItr = lazy(() => import('./components/FileItr/FileItr.tsx'))
const TrackMyReturn = lazy(() => import('./components/TrackMyReturn/TrackMyReturn.tsx'))
const ItrFiling = lazy(() => import('./components/ItrFiling/ItrFiling.tsx'))
const TdsRefund = lazy(() => import('./components/TdsRefund/TdsRefund.tsx'))
const PreviousYearItr = lazy(() => import('./components/PreviousYearItr/PreviousYearItr.tsx'))
const RevisedItr = lazy(() => import('./components/RevisedItr/RevisedItr.tsx'))
const TaxNoticeAssistance = lazy(() => import('./components/TaxNoticeAssistance/TaxNoticeAssistance.tsx'))
const TdsRefundEstimator = lazy(() => import('./components/TdsRefundEstimator/TdsRefundEstimator.tsx'))
const TaxComputation = lazy(() => import('./components/TaxComputation/TaxComputation.tsx'))

export const itrRoutes: RouteObject[] = [
  { path: routePaths.itr.root, element: <Itr /> },
  { path: routePaths.itr.fileItr, element: <FileItr /> },
  { path: routePaths.itr.trackMyReturn, element: <TrackMyReturn /> },
  { path: routePaths.itr.itrFiling, element: <ItrFiling /> },
  { path: routePaths.itr.tdsRefund, element: <TdsRefund /> },
  { path: routePaths.itr.previousYearItr, element: <PreviousYearItr /> },
  { path: routePaths.itr.revisedItr, element: <RevisedItr /> },
  { path: routePaths.itr.taxNoticeAssistance, element: <TaxNoticeAssistance /> },
  { path: routePaths.itr.tdsRefundEstimator, element: <TdsRefundEstimator /> },
  { path: routePaths.itr.taxComputation, element: <TaxComputation /> },
]

