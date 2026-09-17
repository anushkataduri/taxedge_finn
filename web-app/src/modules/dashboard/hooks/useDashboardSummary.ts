import { useAsync } from '@shared/hooks'

import { dashboardService } from '../services/dashboardService'
import type { DashboardSummary } from '../types/dashboard.types'

export const useDashboardSummary = () =>
  useAsync<DashboardSummary>(() => dashboardService.getSummary(), [])
