import { apiClient } from "../../../core/api/apiClient";
import type { CustomerProfile } from "../types/customer.types";
import { authStorage } from "../../authentication/services/authStorage";

export const customerApi = {
  getProfile: async (identifier?: string) => {
    let resolved = identifier;
    if (!resolved) {
      const user = authStorage.getUser();
      const session = authStorage.getSession();
      resolved =
        user?.mobileNumber ||
        (user as any)?.mobile ||
        user?.customerId ||
        (user as any)?.custId ||
        session.activeMobile ||
        (session as any)?.activeCustId;
    }

    const clean = resolved ? String(resolved).trim() : "";
    const params: Record<string, string> = {};
    const headers: Record<string, string> = {};

    if (clean) {
      params["identifier"] = clean;
      headers["X-Customer-Mobile"] = clean;
      headers["X-Customer-Id"] = clean;
    }

    const res = await apiClient.get<any>("/customer/profile", {
      params: Object.keys(params).length > 0 ? params : undefined,
      headers,
    });

    if (res && typeof res === "object") {
      const data = res.data || res;
      return {
        ...data,
        customerId: data.custId || data.customerId || "",
        custId: data.custId || data.customerId || "",
        mobile: data.mobileNumber || data.mobile || "",
        mobileNumber: data.mobileNumber || data.mobile || "",
        name: data.name || data.fullName || "",
        fullName: data.name || data.fullName || "",
        aadhaar: data.aadhaar || data.adhar || "",
        pan: data.pan || "",
        dob: data.dob || data.dateOfBirth || "",
        pincode: data.pincode || data.pinCode || "",
        pinCode: data.pincode || data.pinCode || "",
        customerType: data.customerType || data.custType || "Individual",
      };
    }

    return res;
  },

  updateProfile: async (profile: Partial<CustomerProfile> & { custId?: string; mobileNumber?: string }) => {
    const user = authStorage.getUser();
    const session = authStorage.getSession();
    const resolvedMobile =
      profile.mobileNumber ||
      user?.mobileNumber ||
      (user as any)?.mobile ||
      session.activeMobile;

    const resolvedCustId =
      profile.custId ||
      user?.customerId ||
      (user as any)?.custId ||
      (session as any)?.activeCustId;

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
