import { apiClient } from "../../../core/api/apiClient";
import type { GstRegistrationDraft, GstFilingDraft } from "../types/gstTypes";

export interface GstinEntityDetails {
  gstin: string;
  legalName: string;
  tradeName: string;
  taxpayerScheme: "Regular Scheme" | "QRMP Scheme" | "Composition Scheme";
  state: string;
  stateCode: string;
  status: "Active" | "Suspended" | "Cancelled";
  registrationDate: string;
}

const STATE_CODES: Record<string, string> = {
  "07": "Delhi",
  "24": "Gujarat",
  "27": "Maharashtra",
  "29": "Karnataka",
  "33": "Tamil Nadu",
  "36": "Telangana",
  "19": "West Bengal",
  "09": "Uttar Pradesh",
  "06": "Haryana",
  "08": "Rajasthan",
};

export const gstApi = {
  lookupGstin: async (gstin: string): Promise<GstinEntityDetails | null> => {
    const clean = gstin.trim().toUpperCase();
    if (clean.length !== 15) return null;

    const stateCode = clean.substring(0, 2);
    const stateName = STATE_CODES[stateCode] || "Karnataka";

    // Simulate backend GSTIN lookup (resolves within 100ms)
    return {
      gstin: clean,
      legalName: "Shree Deshmukh Enterprises Private Limited",
      tradeName: "Shree Deshmukh Traders",
      taxpayerScheme: clean.endsWith("Z5") ? "Regular Scheme" : "QRMP Scheme",
      state: stateName,
      stateCode,
      status: "Active",
      registrationDate: "12-Aug-2022",
    };
  },
  submitRegistration: async (draft: Partial<GstRegistrationDraft>) => {
    return apiClient.post<{ applicationId: string; status: string }>("/gst/registration", draft);
  },
  submitFiling: async (draft: Partial<GstFilingDraft>) => {
    return apiClient.post<{ filingId: string; status: string }>("/gst/filing", draft);
  },
  fetchStatus: async (applicationId: string) => {
    return apiClient.get<{ status: string; timeline: any[] }>(`/gst/status/${applicationId}`);
  },
};

export default gstApi;
