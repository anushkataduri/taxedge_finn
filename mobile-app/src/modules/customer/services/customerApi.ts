import { apiClient } from "../../../core/api/apiClient";
import type { CustomerProfile } from "../types/customer.types";
import { useAuthStore } from "../../authentication/store/authStore";

export const customerApi = {
  getProfile: async (identifier?: string) => {
    let resolved = identifier;
    if (!resolved) {
      const state = useAuthStore.getState();
      resolved =
        state.customer?.mobile ||
        state.customer?.customerId ||
        state.authenticatedUser?.mobileNumber ||
        (state.authenticatedUser as any)?.mobile ||
        state.authenticatedUser?.customerId ||
        state.mobileNumber;
    }

    const params = resolved ? { identifier: resolved } : undefined;
    const headers: Record<string, string> = {};
    if (resolved) {
      headers["X-Customer-Mobile"] = resolved;
    }
    return apiClient.get<any>("/customer/profile", { params, headers });
  },

  updateProfile: async (profile: Partial<CustomerProfile> & { custId?: string; mobileNumber?: string }) => {
    const state = useAuthStore.getState();
    const resolvedMobile =
      profile.mobileNumber ||
      state.customer?.mobile ||
      state.authenticatedUser?.mobileNumber ||
      (state.authenticatedUser as any)?.mobile ||
      state.mobileNumber;

    const resolvedCustId =
      profile.custId ||
      state.customer?.customerId ||
      state.authenticatedUser?.customerId ||
      (state.authenticatedUser as any)?.custId;

    const headers: Record<string, string> = {};
    if (resolvedMobile) headers["X-Customer-Mobile"] = resolvedMobile;
    if (resolvedCustId) headers["X-Customer-Id"] = resolvedCustId;

    return apiClient.put<any>(
      "/customer/profile",
      {
        ...profile,
        mobileNumber: resolvedMobile,
        custId: resolvedCustId,
      },
      { headers }
    );
  },
};

export default customerApi;

