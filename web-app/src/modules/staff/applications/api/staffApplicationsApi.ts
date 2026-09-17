import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'
import type { ApplicationStatus } from '@shared/types'

import type {
  StaffApplication,
  StaffApplicationDetail,
  StaffApplicationFilters,
} from '../../types/staff.types'

export const staffApplicationsApi = {
  list: (filters?: StaffApplicationFilters) =>
    apiClient.get<ApiListResponse<StaffApplication>>(apiEndpoints.staff.applications, { params: filters }),

  detail: (id: string) =>
    apiClient.get<StaffApplicationDetail>(apiEndpoints.staff.applicationDetail(id)),

  assign: (id: string, staffId: string | null, note?: string) =>
    apiClient.put<StaffApplicationDetail>(apiEndpoints.staff.applicationAssign(id), { staffId, note }),

  changeStatus: (id: string, status: ApplicationStatus, note?: string) =>
    apiClient.put<StaffApplicationDetail>(apiEndpoints.staff.applicationStage(id), { status, note }),

  raiseQuery: (id: string, message: string) =>
    apiClient.post<StaffApplicationDetail>(apiEndpoints.staff.applicationQuery(id), { message }),

  addNote: (id: string, message: string) =>
    apiClient.post<StaffApplicationDetail>(apiEndpoints.staff.applicationNote(id), { message }),
}
