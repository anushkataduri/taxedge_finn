import { apiClient, apiEndpoints } from '@core/api'

import type { DashboardSummary } from '../types/dashboard.types'

export const dashboardApi = {
  getSummary: () => apiClient.get<DashboardSummary>(apiEndpoints.dashboard.summary),
}
