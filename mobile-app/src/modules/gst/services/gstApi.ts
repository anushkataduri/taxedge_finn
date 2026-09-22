import { apiClient, SERVER_IP, SERVER_PORT } from "../../../core/api/apiClient";
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
  submitRegistration: async (businessData: any) => {
    return apiClient.post<any>("/gst/business/register", businessData);
  },
  updateRegistration: async (gstId: string, businessData: any) => {
    return apiClient.put<any>(`/gst/business/update/${gstId}`, businessData);
  },
  uploadDocument: async (
    gstId: string,
    documentType: string,
    addressProofType: string,
    fileUri: string,
    fileName: string,
  ) => {
    const formData = new FormData();
    formData.append("gstId", gstId);
    formData.append("documentType", documentType);
    if (addressProofType) {
      formData.append("addressProofType", addressProofType);
    }

    // Explicitly cast to any to bypass TS complaining about React Native FormData
    formData.append("file", {
      uri: fileUri,
      name: fileName || "document.pdf",
      type: fileName?.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "image/jpeg",
    } as any);

    // Bypassing fetch entirely using XMLHttpRequest which is bulletproof in React Native
    const baseUrl =
      apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
    const url = `${baseUrl}/gst/documents/upload`;
    console.log("Uploading direct via XHR to:", url);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(
            new Error(
              "Upload failed with status " +
                xhr.status +
                ": " +
                xhr.responseText,
            ),
          );
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during XHR upload"));
      };

      xhr.send(formData);
    });
  },
  createFiling: async (payload: any) => {
    return apiClient.post<string>("/gst/filing/create", payload);
  },
  updateFiling: async (filingId: string, payload: any) => {
    return apiClient.put<string>(`/gst/filing/${filingId}`, payload);
  },
  uploadFilingDocument: async (
    filingId: string,
    documentType: string,
    fileUri: string,
    fileName: string,
  ) => {
    const formData = new FormData();
    formData.append("filingId", filingId);
    formData.append("documentType", documentType);

    formData.append("file", {
      uri: fileUri,
      name: fileName || "document.pdf",
      type: fileName?.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "image/jpeg",
    } as any);

    const baseUrl =
      apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
    const url = `${baseUrl}/gst/filing/documents/upload`;
    console.log("Uploading filing doc via XHR to:", url);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(
            new Error(
              "Upload failed with status " +
                xhr.status +
                ": " +
                xhr.responseText,
            ),
          );
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during XHR filing doc upload"));
      };

      xhr.send(formData);
    });
  },
  fetchFilings: async (gstin: string) => {
    return apiClient.get<any[]>(`/gst/filing/${gstin}`);
  },
  fetchStatus: async (applicationId: string) => {
    return apiClient.get<{ status: string; timeline: any[] }>(
      `/gst/status/${applicationId}`,
    );
  },
};

export default gstApi;
