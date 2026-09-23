import { apiClient, apiEndpoints } from '@core/api'

import type { StaffDashboardData } from '../../types/staff.types'

export const staffDashboardApi = {
  summary: (role: string) =>
    apiClient.get<StaffDashboardData>(apiEndpoints.staff.dashboard, { params: { role } }),
}
