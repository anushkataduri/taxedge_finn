import { apiClient } from "../../../core/api/apiClient";
import { useAuthStore } from "../../authentication/store/authStore";
import type { Application } from "../../../types/domain";

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const state = useAuthStore.getState();
  const customerId = state.customer?.customerId || state.authenticatedUser?.customerId;
  const mobile = state.customer?.mobile || state.authenticatedUser?.mobileNumber || state.mobileNumber;

  if (customerId && customerId.trim()) {
    headers["X-Customer-Id"] = customerId.trim();
  }
  if (mobile && mobile.trim()) {
    headers["X-Customer-Mobile"] = mobile.trim();
  }
  return headers;
}

export const applicationService = {
  getApplications: async (): Promise<Application[]> => {
    const headers = getAuthHeaders();
    const result = await apiClient.get<Application[]>("/applications", { headers });
    return Array.isArray(result) ? result : [];
  },

  getApplicationById: async (id: string): Promise<Application | null> => {
    if (!id) return null;
    const headers = getAuthHeaders();
    try {
      return await apiClient.get<Application>("/applications/" + encodeURIComponent(id), { headers });
    } catch {
      return null;
    }
  },

  createApplication: async (app: Application): Promise<Application> => {
    const headers = getAuthHeaders();
    const state = useAuthStore.getState();
    const customerId = state.customer?.customerId || state.authenticatedUser?.customerId;
    const mobile = state.customer?.mobile || state.authenticatedUser?.mobileNumber || state.mobileNumber;

    const payload = {
      ...app,
      id: app.id && app.id.trim() ? app.id.trim() : `APP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customerId || undefined,
      mobileNumber: mobile || undefined,
    };

    return await apiClient.post<Application>("/applications", payload, { headers });
  },
};

export default applicationService;
