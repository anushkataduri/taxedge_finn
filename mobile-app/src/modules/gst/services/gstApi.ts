import { apiClient, SERVER_IP, SERVER_PORT } from "../../../core/api/apiClient";
import { tokenManager, JwtUtils } from "../../../core/authentication/tokenManager";
import { useAuthStore } from "../../authentication/store/authStore";
import { authStorage } from "../../authentication/services/authStorage";

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

const resolveCustomerId = async (): Promise<string> => {
  try {
    const authState = useAuthStore.getState();
    const custId =
      authState.customer?.customerId ||
      authState.authenticatedUser?.customerId ||
      (authState.authenticatedUser as any)?.custId ||
      (authState.customer as any)?.custId ||
      "";
    if (custId && typeof custId === "string" && custId.trim() !== "" && custId.trim() !== "undefined") {
      return custId.trim();
    }
  } catch {}

  try {
    const user = authStorage.getUser();
    const session = authStorage.getSession();
    const custId =
      user?.customerId ||
      (user as any)?.custId ||
      (session as any)?.activeCustId ||
      "";
    if (custId && typeof custId === "string" && custId.trim() !== "" && custId.trim() !== "undefined") {
      return custId.trim();
    }
  } catch {}

  try {
    const token = await tokenManager.getAccessToken();
    if (token) {
      const payload = JwtUtils.decodePayload(token);
      if (payload?.sub && typeof payload.sub === "string" && payload.sub.trim() !== "" && payload.sub.trim() !== "undefined") {
        return payload.sub.trim();
      }
    }
  } catch {}

  return "";
};

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
  getBusiness: async (gstId: string) => {
    const token = await tokenManager.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const cleanGstId = String(gstId || "").trim();
    return apiClient.get<any>(`/api/v1/gst/business/${cleanGstId}`, { headers });
  },
  getRegistrationDocuments: async (documentId: string) => {
    const token = await tokenManager.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const cleanDocId = String(documentId || "").trim();
    return apiClient.get<any>(`/api/v1/gst/documents/${cleanDocId}`, { headers });
  },
  submitRegistration: async (businessData: any) => {
    const token = await tokenManager.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const payload = { ...businessData };
    if (!payload.customerId || String(payload.customerId).trim() === "") {
      const custId = await resolveCustomerId();
      if (custId) {
        payload.customerId = custId;
      }
    }

    if (!payload.customerId) {
      throw new Error(
        "Customer profile ID is missing. Please log in or complete your profile before registering GST."
      );
    }

    console.log(
      `🌐 [API] POST /api/v1/gst/business/register with customerId: ${payload.customerId}, JWT attached: ${Boolean(token)}`
    );

    return apiClient.post<any>("/api/v1/gst/business/register", payload, { headers });
  },
  updateRegistration: async (gstId: string, businessData: any) => {
    const token = await tokenManager.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const cleanGstId = String(gstId || "").trim();
    if (!cleanGstId) {
      throw new Error("GST ID is required to update business details.");
    }

    const payload = { ...businessData, gstId: cleanGstId };
    if (!payload.customerId || String(payload.customerId).trim() === "") {
      const custId = await resolveCustomerId();
      if (custId) {
        payload.customerId = custId;
      }
    }

    console.log(
      `🌐 [API] PUT /api/v1/gst/business/update/${cleanGstId} with customerId: ${payload.customerId}, JWT attached: ${Boolean(token)}`
    );

    return apiClient.put<any>(
      `/api/v1/gst/business/update/${cleanGstId}`,
      payload,
      { headers }
    );
  },
  uploadAllDocuments: async (
    gstId: string,
    documents: {
      id: string;
      name?: string;
      fileUri?: string | null;
      fileName?: string | null;
      subtitle?: string | null;
    }[],
    addressProofTypeOverride?: string,
  ) => {
    const formData = new FormData();
    let hasFiles = false;
    let selectedAddressType = addressProofTypeOverride || "RENTAL_AGREEMENT";

    for (const doc of documents) {
      if (!doc.fileUri) continue;

      const key = `${doc.id} ${doc.name || ""}`.toLowerCase();
      let fieldName = "";

      if (key.includes("pan")) {
        fieldName = "panCard";
      } else if (key.includes("aadhaar") || key.includes("adhar")) {
        fieldName = "aadhaarCard";
      } else if (key.includes("business")) {
        fieldName = "businessRegistrationProof";
      } else if (key.includes("address") || key.includes("place")) {
        fieldName = "principalPlaceAddressProof";
        if (doc.subtitle && doc.subtitle.trim() && !doc.subtitle.includes("/")) {
          selectedAddressType = doc.subtitle.trim();
        }
      } else if (
        key.includes("bank") ||
        key.includes("cheque") ||
        key.includes("passbook") ||
        key.includes("statement")
      ) {
        fieldName = "bankPassbookOrCancelledCheque";
      } else if (
        key.includes("photo") ||
        key.includes("passport") ||
        key.includes("image")
      ) {
        fieldName = "passportSizePhotograph";
      }

      if (fieldName) {
        hasFiles = true;
        const name = doc.fileName || `${fieldName}.pdf`;
        const isPdf = name.toLowerCase().endsWith(".pdf");
        formData.append(fieldName, {
          uri: doc.fileUri,
          name: name,
          type: isPdf ? "application/pdf" : "image/jpeg",
        } as any);
      }
    }

    if (!hasFiles) {
      return "No documents selected for upload";
    }

    // Always attach principalPlaceAddressType enum when uploading address proof
    const rawAddr = (selectedAddressType || "RENTAL_AGREEMENT")
      .toUpperCase()
      .replace(/[^A-Z]/g, "_");
    let enumAddr = "RENTAL_AGREEMENT";
    if (rawAddr.includes("OWNER")) enumAddr = "OWNERSHIP_PROOF";
    else if (rawAddr.includes("ELECTRI")) enumAddr = "ELECTRICITY_BILL";
    else if (rawAddr.includes("OTHER")) enumAddr = "OTHER_ADDRESS_PROOF";

    formData.append("principalPlaceAddressType", enumAddr);

    const baseUrl =
      apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
    const url = `${baseUrl}/api/v1/gst/documents/${gstId}/register`;
    console.log(`🌐 [API] Uploading ALL documents at once via XHR to: ${url}`);

    const token = await tokenManager.getAccessToken();

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

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
        reject(new Error("Network error during XHR document upload"));
      };

      xhr.send(formData);
    });
  },
  updateAllDocuments: async (
    documentId: string,
    documents: {
      id: string;
      name?: string;
      fileUri?: string | null;
      fileName?: string | null;
      subtitle?: string | null;
    }[],
    addressProofTypeOverride?: string,
  ) => {
    const formData = new FormData();
    let hasFiles = false;
    let selectedAddressType = addressProofTypeOverride || "RENTAL_AGREEMENT";

    for (const doc of documents) {
      if (!doc.fileUri) continue;

      const key = `${doc.id} ${doc.name || ""}`.toLowerCase();
      let fieldName = "";

      if (key.includes("pan")) {
        fieldName = "panCard";
      } else if (key.includes("aadhaar") || key.includes("adhar")) {
        fieldName = "aadhaarCard";
      } else if (key.includes("business")) {
        fieldName = "businessRegistrationProof";
      } else if (key.includes("address") || key.includes("place")) {
        fieldName = "principalPlaceAddressProof";
        if (doc.subtitle && doc.subtitle.trim() && !doc.subtitle.includes("/")) {
          selectedAddressType = doc.subtitle.trim();
        }
      } else if (
        key.includes("bank") ||
        key.includes("cheque") ||
        key.includes("passbook") ||
        key.includes("statement")
      ) {
        fieldName = "bankPassbookOrCancelledCheque";
      } else if (
        key.includes("photo") ||
        key.includes("passport") ||
        key.includes("image")
      ) {
        fieldName = "passportSizePhotograph";
      }

      if (fieldName) {
        hasFiles = true;
        const name = doc.fileName || `${fieldName}.pdf`;
        const isPdf = name.toLowerCase().endsWith(".pdf");
        formData.append(fieldName, {
          uri: doc.fileUri,
          name: name,
          type: isPdf ? "application/pdf" : "image/jpeg",
        } as any);
      }
    }

    if (!hasFiles) {
      return "No documents selected for upload";
    }

    const rawAddr = (selectedAddressType || "RENTAL_AGREEMENT")
      .toUpperCase()
      .replace(/[^A-Z]/g, "_");
    let enumAddr = "RENTAL_AGREEMENT";
    if (rawAddr.includes("OWNER")) enumAddr = "OWNERSHIP_PROOF";
    else if (rawAddr.includes("ELECTRI")) enumAddr = "ELECTRICITY_BILL";
    else if (rawAddr.includes("OTHER")) enumAddr = "OTHER_ADDRESS_PROOF";

    formData.append("principalPlaceAddressType", enumAddr);

    const baseUrl =
      apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
    const url = `${baseUrl}/api/v1/gst/documents/${documentId}/update`;
    console.log(`🌐 [API] PUT updating documents via XHR to: ${url}`);

    const token = await tokenManager.getAccessToken();

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(
            new Error(
              "Update failed with status " +
                xhr.status +
                ": " +
                xhr.responseText,
            ),
          );
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during XHR document update"));
      };

      xhr.send(formData);
    });
  },
  uploadDocument: async (
    gstId: string,
    documentType: string,
    addressProofType: string,
    fileUri: string,
    fileName: string,
  ) => {
    const formData = new FormData();

    // Map doc type to backend parameter name expected by /documents/{gstId}/register
    const upperDoc = (documentType || "").toUpperCase();
    let fieldName = "file";
    if (upperDoc.includes("PAN")) {
      fieldName = "panCard";
    } else if (upperDoc.includes("AADHAAR")) {
      fieldName = "aadhaarCard";
    } else if (upperDoc.includes("BUSINESS")) {
      fieldName = "businessRegistrationProof";
    } else if (upperDoc.includes("ADDRESS") || upperDoc.includes("PLACE")) {
      fieldName = "principalPlaceAddressProof";
      const rawAddr = (addressProofType || "RENTAL_AGREEMENT").toUpperCase().replace(/\s+/g, "_");
      let enumAddr = "RENTAL_AGREEMENT";
      if (rawAddr.includes("OWNER")) enumAddr = "OWNERSHIP_PROOF";
      else if (rawAddr.includes("ELECTRI")) enumAddr = "ELECTRICITY_BILL";
      else if (rawAddr.includes("OTHER")) enumAddr = "OTHER_ADDRESS_PROOF";
      formData.append("principalPlaceAddressType", enumAddr);
    } else if (upperDoc.includes("BANK") || upperDoc.includes("CHEQUE") || upperDoc.includes("PASSBOOK")) {
      fieldName = "bankPassbookOrCancelledCheque";
    } else if (upperDoc.includes("PHOTO") || upperDoc.includes("PASSPORT") || upperDoc.includes("AUTHORIZATION")) {
      fieldName = "passportSizePhotograph";
    }

    // Explicitly cast to any to bypass TS complaining about React Native FormData
    formData.append(fieldName, {
      uri: fileUri,
      name: fileName || "document.pdf",
      type: fileName?.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "image/jpeg",
    } as any);

    // Bypassing fetch entirely using XMLHttpRequest which is bulletproof in React Native
    const baseUrl =
      apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
    const url = `${baseUrl}/api/v1/gst/documents/${gstId}/register`;
    console.log(`Uploading document [${fieldName}] direct via XHR to:`, url);

    const token = await tokenManager.getAccessToken();

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

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
    const token = await tokenManager.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const finalPayload = { ...payload };
    if (!finalPayload.customerId || String(finalPayload.customerId).trim() === "" || String(finalPayload.customerId).trim() === "undefined") {
      const custId = await resolveCustomerId();
      if (custId) finalPayload.customerId = custId;
    }

    if (finalPayload.returnType) {
      const rt = String(finalPayload.returnType).toUpperCase();
      finalPayload.returnType = rt.includes("3B") || rt.includes("3_B") ? "GSTR_3B" : "GSTR_1";
    }

    if (finalPayload.financialYear) {
      finalPayload.financialYear = String(finalPayload.financialYear).replace(/^FY\s*/i, "").trim();
    }

    console.log(
      `🌐 [API] POST /api/v1/gst/filing/create with customerId: ${finalPayload.customerId}, returnType: ${finalPayload.returnType}, JWT: ${Boolean(token)}`
    );

    return apiClient.post<string>("/api/v1/gst/filing/create", finalPayload, { headers });
  },
  updateFiling: async (filingId: string, payload: any) => {
    const token = await tokenManager.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const finalPayload = { ...payload };
    if (!finalPayload.customerId || String(finalPayload.customerId).trim() === "" || String(finalPayload.customerId).trim() === "undefined") {
      const custId = await resolveCustomerId();
      if (custId) finalPayload.customerId = custId;
    }

    if (finalPayload.returnType) {
      const rt = String(finalPayload.returnType).toUpperCase();
      finalPayload.returnType = rt.includes("3B") || rt.includes("3_B") ? "GSTR_3B" : "GSTR_1";
    }

    if (finalPayload.financialYear) {
      finalPayload.financialYear = String(finalPayload.financialYear).replace(/^FY\s*/i, "").trim();
    }

    const cleanFilingId = String(filingId || "").trim();
    console.log(
      `🌐 [API] PUT /api/v1/gst/filing/update/${cleanFilingId} with customerId: ${finalPayload.customerId}, returnType: ${finalPayload.returnType}, JWT: ${Boolean(token)}`
    );

    return apiClient.put<string>(`/api/v1/gst/filing/update/${cleanFilingId}`, finalPayload, { headers });
  },
  getFilingById: async (filingId: string) => {
    const token = await tokenManager.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const cleanId = String(filingId || "").trim();
    console.log(`🌐 [API] GET /api/v1/gst/filing/${cleanId}`);
    return apiClient.get<any>(`/api/v1/gst/filing/${cleanId}`, { headers });
  },
  getFilingDocuments: async (gstfilingId: string) => {
    const token = await tokenManager.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const cleanId = String(gstfilingId || "").trim();
    console.log(`🌐 [API] GET /api/v1/gst/filing/documents/${cleanId}`);
    return apiClient.get<any>(`/api/v1/gst/filing/documents/${cleanId}`, { headers });
  },
  uploadAllFilingDocuments: async (
    filingId: string,
    documents: {
      name?: string;
      id?: string;
      fileUri?: string | null;
      fileName?: string | null;
    }[],
  ) => {
    const formData = new FormData();
    let hasFiles = false;

    for (const doc of documents) {
      if (!doc.fileUri) continue;
      const key = `${doc.id || ""} ${doc.name || ""}`.toLowerCase();
      let fieldName = "";

      if (key.includes("sales")) fieldName = "salesInvoice";
      else if (key.includes("purchase")) fieldName = "purchaseInvoices";
      else if (key.includes("2b") || key.includes("itc")) fieldName = "gstr2bItcStatement";
      else if (key.includes("credit")) fieldName = "creditNotes";
      else if (key.includes("debit")) fieldName = "debitNotes";
      else if (key.includes("e-invoice") || key.includes("einvoice")) fieldName = "eInvoiceData";
      else if (key.includes("e-way") || key.includes("eway")) fieldName = "eWayBillData";
      else if (key.includes("expense") || key.includes("voucher")) fieldName = "expenseInvoicesAndVouchers";
      else if (key.includes("bank")) fieldName = "bankStatement";
      else if (key.includes("previous") && key.includes("acknowledgement")) fieldName = "previousFilingAcknowledgement";
      else if (key.includes("previous")) fieldName = "previousGstReturns";
      else fieldName = "otherSupportingDocuments";

      if (fieldName) {
        hasFiles = true;
        const name = doc.fileName || `${fieldName}.pdf`;
        const isPdf = name.toLowerCase().endsWith(".pdf");
        formData.append(fieldName, {
          uri: doc.fileUri,
          name: name,
          type: isPdf ? "application/pdf" : "image/jpeg",
        } as any);
      }
    }

    if (!hasFiles) return "No documents selected for upload";

    const baseUrl = apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
    const url = `${baseUrl}/api/v1/gst/filing/documents/${filingId}/upload`;
    console.log(`🌐 [API] Uploading ALL filing documents at once via XHR to: ${url}`);

    const token = await tokenManager.getAccessToken();

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          let errText = xhr.responseText;
          try {
            const parsed = JSON.parse(xhr.responseText);
            if (parsed.message) {
              errText = parsed.message;
            }
          } catch {}
          reject(
            new Error(
              "Upload failed with status " +
                xhr.status +
                ": " +
                errText,
            ),
          );
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during XHR filing upload"));
      };

      xhr.send(formData);
    });
  },
  updateAllFilingDocuments: async (
    filingId: string,
    documents: {
      name?: string;
      id?: string;
      fileUri?: string | null;
      fileName?: string | null;
    }[],
  ) => {
    const formData = new FormData();
    let hasFiles = false;

    for (const doc of documents) {
      if (!doc.fileUri) continue;
      const key = `${doc.id || ""} ${doc.name || ""}`.toLowerCase();
      let fieldName = "";

      if (key.includes("sales")) fieldName = "salesInvoice";
      else if (key.includes("purchase")) fieldName = "purchaseInvoices";
      else if (key.includes("2b") || key.includes("itc")) fieldName = "gstr2bItcStatement";
      else if (key.includes("credit")) fieldName = "creditNotes";
      else if (key.includes("debit")) fieldName = "debitNotes";
      else if (key.includes("e-invoice") || key.includes("einvoice")) fieldName = "eInvoiceData";
      else if (key.includes("e-way") || key.includes("eway")) fieldName = "eWayBillData";
      else if (key.includes("expense") || key.includes("voucher")) fieldName = "expenseInvoicesAndVouchers";
      else if (key.includes("bank")) fieldName = "bankStatement";
      else if (key.includes("previous") && key.includes("acknowledgement")) fieldName = "previousFilingAcknowledgement";
      else if (key.includes("previous")) fieldName = "previousGstReturns";
      else fieldName = "otherSupportingDocuments";

      if (fieldName) {
        hasFiles = true;
        const name = doc.fileName || `${fieldName}.pdf`;
        const isPdf = name.toLowerCase().endsWith(".pdf");
        formData.append(fieldName, {
          uri: doc.fileUri,
          name: name,
          type: isPdf ? "application/pdf" : "image/jpeg",
        } as any);
      }
    }

    if (!hasFiles) return "No documents selected for upload";

    const cleanFilingId = String(filingId || "").trim();
    const baseUrl = apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
    const url = `${baseUrl}/api/v1/gst/filing/documents/${cleanFilingId}/update`;
    console.log(`🌐 [API] PUT updating filing documents via XHR to: ${url}`);

    const token = await tokenManager.getAccessToken();

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else if (xhr.status === 404 || xhr.status === 500) {
          console.log(`🌐 [API] PUT update returned ${xhr.status}, falling back to POST upload...`);
          gstApi.uploadAllFilingDocuments(cleanFilingId, documents).then(resolve).catch(reject);
        } else {
          let errText = xhr.responseText;
          try {
            const parsed = JSON.parse(xhr.responseText);
            if (parsed.message) {
              errText = parsed.message;
            }
          } catch {}
          reject(
            new Error(
              "Update failed with status " +
                xhr.status +
                ": " +
                errText,
            ),
          );
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during XHR filing update"));
      };

      xhr.send(formData);
    });
  },
  uploadFilingDocument: async (
    filingId: string,
    documentType: string,
    fileUri: string,
    fileName: string,
  ) => {
    const formData = new FormData();
    const upper = (documentType || "").toLowerCase();
    let fieldName = "otherSupportingDocuments";
    if (upper.includes("sales")) fieldName = "salesInvoice";
    else if (upper.includes("purchase")) fieldName = "purchaseInvoices";
    else if (upper.includes("2b") || upper.includes("itc")) fieldName = "gstr2bItcStatement";
    else if (upper.includes("credit")) fieldName = "creditNotes";
    else if (upper.includes("debit")) fieldName = "debitNotes";
    else if (upper.includes("e_invoice") || upper.includes("einvoice")) fieldName = "eInvoiceData";
    else if (upper.includes("e_way") || upper.includes("eway")) fieldName = "eWayBillData";
    else if (upper.includes("expense")) fieldName = "expenseInvoicesAndVouchers";
    else if (upper.includes("bank")) fieldName = "bankStatement";
    else if (upper.includes("previous_gst")) fieldName = "previousGstReturns";
    else if (upper.includes("acknowledgement")) fieldName = "previousFilingAcknowledgement";

    formData.append(fieldName, {
      uri: fileUri,
      name: fileName || `${fieldName}.pdf`,
      type: fileName?.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "image/jpeg",
    } as any);

    const baseUrl =
      apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
    const url = `${baseUrl}/api/v1/gst/filing/documents/${filingId}/upload`;
    console.log("Uploading filing doc via XHR to:", url);

    const token = await tokenManager.getAccessToken();

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

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
    return apiClient.get<any[]>(`/api/v1/gst/filing/${gstin}`);
  },
  fetchStatus: async (applicationId: string) => {
    return apiClient.get<{ status: string; timeline: any[] }>(
      `/api/v1/gst/status/${applicationId}`,
    );
  },
};

export default gstApi;
