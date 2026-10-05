/**
 * API Service: GST Compliance
 * Handles multipart creation, updates, and retrieval of GST compliance requests.
 */

import { apiClient } from "@/core/api/apiClient";
import { getActiveBaseUrl } from "@/core/api/apiConfig";
import { tokenManager } from "@/core/authentication/tokenManager";
import { tokenRefreshManager } from "@/core/authentication/tokenRefreshManager";
import { getResolvedCustomerId } from "@/modules/gst/gst-filing/hooks/gstFilingHelpers";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parseDateToISO(dateStr: string): string | null {
  if (!dateStr) return null;
  const parts = dateStr.trim().split(" ");
  if (parts.length === 3) {
    const d = parts[0].padStart(2, "0");
    const m = String(MONTHS.indexOf(parts[1]) + 1).padStart(2, "0");
    const y = parts[2];
    if (m !== "00") return `${y}-${m}-${d}`;
  }

  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return null;
}

export const gstComplianceApi = {
  createCompliance: async (data: any) => {
    const formData = new FormData();
    const custId = await getResolvedCustomerId();

    const dto = {
      customerId: custId || data.customerId || "",
      gstin: data.gstin ? data.gstin.trim() : "29AAAAA0000A1Z5",
      financialYear: data.financialYear || "2024-25",
      requestType:
        data.requestType === "Reconciliation Support"
          ? "RECONCILIATION_SUPPORT"
          : "NOTICE_RESPONSE",
      gstr2bNumber: data.gstr2bRef?.trim() ? data.gstr2bRef : "NOT_PROVIDED",
      noticeNumber: data.noticeNumber || "",
      noticeIssueDate: parseDateToISO(data.noticeIssueDate),
      replyDueDate: parseDateToISO(data.replyDueDate),
      message:
        data.requestType === "Reconciliation Support"
          ? data.reconciliationRemarks || ""
          : data.noticeRemarks || "",
    };

    formData.append("data", JSON.stringify(dto));

    if (data.purchaseDoc?.uri) {
      formData.append("reconciliationFile1", {
        uri: data.purchaseDoc.uri,
        name: data.purchaseDoc.name || "recon1.pdf",
        type: data.purchaseDoc.name?.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg",
      } as any);
    }

    if (data.salesDoc?.uri) {
      formData.append("reconciliationFile2", {
        uri: data.salesDoc.uri,
        name: data.salesDoc.name || "recon2.pdf",
        type: data.salesDoc.name?.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg",
      } as any);
    }

    if (data.noticeDoc?.uri) {
      formData.append("noticeFile", {
        uri: data.noticeDoc.uri,
        name: data.noticeDoc.name || "notice.pdf",
        type: data.noticeDoc.name?.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg",
      } as any);
    }

    const baseUrl = apiClient.getBaseUrl() || (await getActiveBaseUrl());
    if (!baseUrl) {
      throw new Error(
        "Backend URL is not configured. Set the API URL before submitting GST compliance data.",
      );
    }
    const url = `${baseUrl.replace(/\/$/, "")}/api/v1/gst/compliance/create`;

    let token = await tokenManager.getAccessToken();
    if (!token || !(await tokenManager.hasValidToken())) {
      const refreshed = await tokenRefreshManager.attemptRefresh();
      if (refreshed) {
        token = await tokenManager.getAccessToken();
      }
    }

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
            if (parsed.message) errText = parsed.message;
          } catch {}
          reject(new Error(errText || `Server responded with ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network connection error during compliance submission."));
      };

      xhr.send(formData);
    });
  },

  updateCompliance: async (gstin: string, id: string, data: any) => {
    const formData = new FormData();
    const custId = await getResolvedCustomerId();

    const dto = {
      customerId: custId || data.customerId || "",
      gstin: gstin.trim(),
      financialYear: data.financialYear || "2024-25",
      requestType:
        data.requestType === "Reconciliation Support"
          ? "RECONCILIATION_SUPPORT"
          : "NOTICE_RESPONSE",
      gstr2bNumber: data.gstr2bRef?.trim() ? data.gstr2bRef : "NOT_PROVIDED",
      noticeNumber: data.noticeNumber || "",
      noticeIssueDate: parseDateToISO(data.noticeIssueDate),
      replyDueDate: parseDateToISO(data.replyDueDate),
      message:
        data.requestType === "Reconciliation Support"
          ? data.reconciliationRemarks || ""
          : data.noticeRemarks || "",
    };

    formData.append("data", JSON.stringify(dto));

    if (data.purchaseDoc?.uri) {
      formData.append("reconciliationFile1", {
        uri: data.purchaseDoc.uri,
        name: data.purchaseDoc.name || "recon1.pdf",
        type: data.purchaseDoc.name?.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg",
      } as any);
    }

    if (data.salesDoc?.uri) {
      formData.append("reconciliationFile2", {
        uri: data.salesDoc.uri,
        name: data.salesDoc.name || "recon2.pdf",
        type: data.salesDoc.name?.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg",
      } as any);
    }

    if (data.noticeDoc?.uri) {
      formData.append("noticeFile", {
        uri: data.noticeDoc.uri,
        name: data.noticeDoc.name || "notice.pdf",
        type: data.noticeDoc.name?.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg",
      } as any);
    }

    const baseUrl = apiClient.getBaseUrl() || (await getActiveBaseUrl());
    const url = `${baseUrl.replace(/\/$/, "")}/api/v1/gst/compliance/${encodeURIComponent(gstin)}/${encodeURIComponent(id)}`;

    let token = await tokenManager.getAccessToken();
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          let errText = xhr.responseText;
          try {
            const parsed = JSON.parse(xhr.responseText);
            if (parsed.message) errText = parsed.message;
          } catch {}
          reject(new Error(errText || `Server responded with ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error("Network connection error during compliance update."));
      xhr.send(formData);
    });
  },

  getCompliance: async (gstin: string, id: string) => {
    return apiClient.get<any>(
      `/api/v1/gst/compliance/${encodeURIComponent(gstin)}/${encodeURIComponent(id)}`,
    );
  },
};
