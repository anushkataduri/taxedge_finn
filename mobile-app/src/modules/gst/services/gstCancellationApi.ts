import { apiClient } from "../../../core/api/apiClient";
import { getActiveBaseUrl } from "../../../core/api/apiConfig";
import { tokenManager } from "../../../core/authentication/tokenManager";
import { tokenRefreshManager } from "../../../core/authentication/tokenRefreshManager";
import type { CancellationFormData, CancellationDto } from "../gst-cancellation/types/gstCancellationTypes";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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

export class GstCancellationError extends Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = "GstCancellationError";
  }
}

export const gstCancellationApi = {
  createCancellation: async (data: CancellationFormData): Promise<string> => {
    const formData = new FormData();

    // Build DTO matching backend GstCancellationDto
    const dto: CancellationDto = {
      gstin: data.gstin || "29AAAAA0000A1Z5",
      reasonForCancellation:
        data.reason === "Other Valid Reason" ? data.otherReason : data.reason,
      dateCancellationIsSought: parseDateToISO(data.cancellationDate),
      closingStockAndInputTaxReversal: data.closingStock,
      pendingDuesLiabilities: data.pendingLiabilities || "Nil",
      lastGstr3bFiledArnPeriod: data.lastGstr3b,
    };

    formData.append("data", JSON.stringify(dto));

    if (data.supportingDoc?.uri) {
      formData.append("supportingProofDocument", {
        uri: data.supportingDoc.uri,
        name: data.supportingDoc.name || "supporting_proof.pdf",
        type: data.supportingDoc.name?.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg",
      } as any);
    }

    const baseUrl = apiClient.getBaseUrl() || (await getActiveBaseUrl());
    if (!baseUrl) {
      throw new GstCancellationError(
        "Backend URL is not configured. Set the API URL before submitting GST cancellation data."
      );
    }
    const url = `${baseUrl.replace(/\/$/, "")}/api/v1/gst/cancellation`;

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
          reject(
            new GstCancellationError(
              `Cancellation submission failed (${xhr.status}): ${xhr.responseText}`,
              xhr.status
            )
          );
        }
      };

      xhr.onerror = () => {
        reject(new GstCancellationError("Network error during GST Cancellation upload"));
      };

      xhr.send(formData);
    });
  },
};

export default gstCancellationApi;
