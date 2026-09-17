import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type {
  GstApplication,
  GstListFilters,
  GstRegistrationPayload,
  GstReturn,
  GstReturnPayload,
} from '../types/gst.types'

export const gstApi = {
  listApplications: (filters?: GstListFilters) =>
    apiClient.get<ApiListResponse<GstApplication>>(apiEndpoints.gst.list, { params: filters }),
  getApplication: (id: string) => apiClient.get<GstApplication>(apiEndpoints.gst.detail(id)),
  register: (payload: GstRegistrationPayload) =>
    apiClient.post<GstApplication>(apiEndpoints.gst.register, payload),
  listReturns: () => apiClient.get<ApiListResponse<GstReturn>>(apiEndpoints.gst.returns),
  fileReturn: (payload: GstReturnPayload) => apiClient.post<GstReturn>(apiEndpoints.gst.returns, payload),
}
