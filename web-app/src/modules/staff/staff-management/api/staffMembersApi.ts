import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type { StaffMember, StaffMemberPayload } from '../../types/staff.types'

export const staffMembersApi = {
  list: () => apiClient.get<ApiListResponse<StaffMember>>(apiEndpoints.staff.members),
  detail: (id: string) => apiClient.get<StaffMember>(apiEndpoints.staff.memberDetail(id)),
  create: (payload: StaffMemberPayload) => apiClient.post<StaffMember>(apiEndpoints.staff.members, payload),
  update: (id: string, payload: Partial<StaffMemberPayload>) =>
    apiClient.put<StaffMember>(apiEndpoints.staff.memberDetail(id), payload),
  setActive: (id: string, isActive: boolean) =>
    apiClient.patch<StaffMember>(apiEndpoints.staff.memberDetail(id), { isActive }),
}
