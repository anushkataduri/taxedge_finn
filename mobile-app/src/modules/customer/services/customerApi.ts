import type { CustomerProfile } from "../types/customer.types";
import { authStorage } from "../../authentication/services/authStorage";

export const customerApi = {
  getProfile: async (identifier?: string): Promise<any> => {
    const cleanMobile = identifier ? String(identifier).replace(/\D/g, "") : "";
    const user = (cleanMobile ? authStorage.getUserByMobile(cleanMobile) : null) || authStorage.getUser();
    const session = authStorage.getSession();

    if (!user) {
      return null;
    }

    const custId = user.customerId || (user as any).custId || (session as any)?.activeCustId || "";
    const mobile = user.mobileNumber || (user as any).mobile || session.activeMobile || cleanMobile || "";
    const name = user.name || (user as any).fullName || "";
    const pin = user.pincode || (user as any).pinCode || "";

    return {
      ...user,
      customerId: custId,
      custId: custId,
      mobile: mobile,
      mobileNumber: mobile,
      name: name,
      fullName: name,
      aadhaar: user.aadhaar || (user as any).adhar || "",
      pan: user.pan || "",
      dob: user.dob || (user as any).dateOfBirth || "",
      pincode: pin,
      pinCode: pin,
      customerType: user.customerType || (user as any).custType || "Individual",
    };
  },

  updateProfile: async (profile: Partial<CustomerProfile> & { custId?: string; mobileNumber?: string }) => {
    const user = authStorage.getUser();
    const session = authStorage.getSession();
    const resolvedMobile =
      profile.mobileNumber ||
      user?.mobileNumber ||
      (user as any)?.mobile ||
      session.activeMobile ||
      "";

    const resolvedCustId =
      profile.custId ||
      user?.customerId ||
      (user as any)?.custId ||
      (session as any)?.activeCustId ||
      "";

    const updatedUser = {
      ...(user || {}),
      ...profile,
      customerId: resolvedCustId,
      mobileNumber: resolvedMobile,
    };

    if (resolvedMobile) {
      authStorage.saveUser(updatedUser as any);
    }

    return { success: true, data: updatedUser };
  },
};

export default customerApi;
