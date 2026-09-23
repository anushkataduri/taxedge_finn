import { apiClient, SERVER_IP, SERVER_PORT } from "../../../core/api/apiClient";

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

export const gstCancellationApi = {
  createCancellation: async (data: any) => {
    const formData = new FormData();

    // Build DTO matching the backend GstCancellationDto
    const dto = {
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

    const baseUrl =
      apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
    const url = `${baseUrl}/gst/cancellation`;

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(
            new Error(
              "Cancellation upload failed: " +
                xhr.status +
                " " +
                xhr.responseText,
            ),
          );
        }
      };

      xhr.onerror = () =>
        reject(new Error("Network error during Cancellation upload"));

      xhr.send(formData);
    });
  },
};
