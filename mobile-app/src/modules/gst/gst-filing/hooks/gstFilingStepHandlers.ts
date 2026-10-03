/**
 * GST Filing Step Submission Handlers
 * Encapsulates backend submission, document upload, and flow transitions for each step.
 */

import { Alert } from "react-native";
import { gstApi } from "@/modules/gst/services/gstApi";
import { useApplicationStore } from "@/store/applicationStore";
import { FilingDocItem } from "@/modules/gst/gst-filing/config/gstFilingDocumentsConfig";
import { GstFilingPeriodData } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstFilingPeriodStep";
import {
  getResolvedCustomerId,
  buildFilingPayload,
  extractUploadedDocumentNames,
} from "@/modules/gst/gst-filing/hooks/gstFilingHelpers";

export async function submitPeriodStep({
  periodData,
  targetFilingId,
  isEditMode,
  setFilingId,
  setCurrentStep,
  setIsEditMode,
  setIsSubmitting,
}: {
  periodData: GstFilingPeriodData;
  targetFilingId: string;
  isEditMode: boolean;
  setFilingId: (id: string) => void;
  setCurrentStep: (step: number) => void;
  setIsEditMode: (val: boolean) => void;
  setIsSubmitting: (val: boolean) => void;
}): Promise<void> {
  setIsSubmitting(true);
  try {
    const custId = await getResolvedCustomerId();
    const payload = buildFilingPayload(periodData, custId);

    if (targetFilingId) {
      try {
        await gstApi.updateFiling(targetFilingId, payload);
        setFilingId(targetFilingId);
        if (isEditMode) {
          Alert.alert("Success", "Filing period details updated successfully.");
          setIsEditMode(false);
          setCurrentStep(2);
          return;
        }
        setCurrentStep(1);
        return;
      } catch (updateErr: any) {
        const errMsg = String(updateErr?.message || updateErr || "");
        if (
          errMsg.includes("does not belong to GSTIN") ||
          errMsg.includes("not found with ID")
        ) {
          console.log(
            `[FilingFlow] Target filing ID ${targetFilingId} does not belong to GSTIN ${periodData.gstin}. Creating a new filing session...`,
          );
        } else {
          throw updateErr;
        }
      }
    }

    if (!payload.customerId) {
      Alert.alert(
        "Authentication Notice",
        "Customer profile session not found. Please re-login to proceed with filing.",
      );
      return;
    }

    const response = await gstApi.createFiling(payload);
    const responseStr =
      typeof response === "string" ? response : JSON.stringify(response);
    const match = responseStr.match(/Filing ID:\s*([A-Za-z0-9_-]+)/i);

    let resolvedId = match ? match[1] : "";
    if (!resolvedId) {
      const filings = await gstApi.fetchFilings(periodData.gstin);
      if (filings && filings.length > 0) {
        const sortedFilings = [...filings].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        const latest = sortedFilings[sortedFilings.length - 1];
        resolvedId = latest.gstfilingId || latest.id || "";
      }
    }

    if (resolvedId) {
      setFilingId(resolvedId);
    }
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep(2);
      return;
    }
    setCurrentStep(1);
  } catch (err: any) {
    Alert.alert(
      "Filing Notice",
      err?.message || "Failed to update filing details. Please try again.",
    );
  } finally {
    setIsSubmitting(false);
  }
}

export async function submitDocumentsStep({
  targetFilingId: initialTargetId,
  periodData,
  documents,
  isEditMode,
  setFilingId,
  setDocuments,
  setCurrentStep,
  setIsEditMode,
  setIsSubmitting,
}: {
  targetFilingId: string;
  periodData: GstFilingPeriodData;
  documents: FilingDocItem[];
  isEditMode: boolean;
  setFilingId: (id: string) => void;
  setDocuments: React.Dispatch<React.SetStateAction<FilingDocItem[]>>;
  setCurrentStep: (step: number) => void;
  setIsEditMode: (val: boolean) => void;
  setIsSubmitting: (val: boolean) => void;
}): Promise<void> {
  let targetFilingId = initialTargetId;

  if (!targetFilingId) {
    try {
      const custId = await getResolvedCustomerId();
      const payload = buildFilingPayload(periodData, custId);
      const response = await gstApi.createFiling(payload);
      const responseStr =
        typeof response === "string" ? response : JSON.stringify(response);
      const match = responseStr.match(/Filing ID:\s*([A-Za-z0-9_-]+)/i);
      if (match && match[1]) {
        targetFilingId = match[1];
        setFilingId(targetFilingId);
      }
    } catch (createErr) {
      console.debug("[DocumentStep] Auto-creation of filing session failed:", createErr);
    }
  }

  if (!targetFilingId) {
    Alert.alert(
      "Notice",
      "Filing session not found. Please review period details first.",
    );
    setCurrentStep(0);
    return;
  }

  setIsSubmitting(true);
  try {
    const docsToUpload = documents.filter((d) => d.fileUri);
    if (docsToUpload.length > 0) {
      if (isEditMode) {
        await gstApi.updateAllFilingDocuments(targetFilingId, docsToUpload);
        Alert.alert("Success", "Filing documents updated successfully.");
      } else {
        await gstApi.uploadAllFilingDocuments(targetFilingId, docsToUpload);
      }
      docsToUpload.forEach((d) => ((d as any).uploadedToBackend = true));
      setDocuments([...documents]);
    }
    if (isEditMode) {
      setIsEditMode(false);
    }
    setCurrentStep(2);
  } catch (uploadErr: any) {
    Alert.alert(
      "Upload Failed",
      uploadErr?.message || "Failed to upload documents. Please try again.",
    );
  } finally {
    setIsSubmitting(false);
  }
}

export async function submitReviewStep({
  missingDocsCount,
  filingId,
  periodData,
  setCurrentStep,
  setIsSubmitting,
}: {
  missingDocsCount: number;
  filingId: string | null;
  periodData: GstFilingPeriodData;
  setCurrentStep: (step: number) => void;
  setIsSubmitting: (val: boolean) => void;
}): Promise<void> {
  if (missingDocsCount > 0) {
    Alert.alert(
      "Documents Missing",
      `You have ${missingDocsCount} missing required document(s). Please upload all required documents before submitting your return.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Upload Now", onPress: () => setCurrentStep(1) },
      ],
    );
    return;
  }

  if (filingId && periodData.calculationMethod === "manual_estimates") {
    setIsSubmitting(true);
    try {
      const custId = await getResolvedCustomerId();
      const payload = buildFilingPayload(periodData, custId, true);
      await gstApi.updateFiling(filingId, payload);
    } catch (err) {
      console.debug("[ReviewStep] Update manual estimates notice:", err);
    } finally {
      setIsSubmitting(false);
    }
  }
  setCurrentStep(3);
}

export function promptPayLaterSubmission({
  periodData,
  selectedMethod,
  filingId,
  documents,
  setCreatedAppId,
  clearGstFilingDraft,
  setIsSubmitting,
  setCurrentStep,
}: {
  periodData: GstFilingPeriodData;
  selectedMethod: string;
  filingId: string | null;
  documents: FilingDocItem[];
  setCreatedAppId: (id: string) => void;
  clearGstFilingDraft: () => void;
  setIsSubmitting: (val: boolean) => void;
  setCurrentStep: (step: number) => void;
}): void {
  Alert.alert(
    "Payment Gateway Unavailable",
    "Online payment processing is currently unavailable on this system. Would you like to submit your filing request for CA review and complete payment later?",
    [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => setIsSubmitting(false),
      },
      {
        text: "Submit (Pay Later)",
        onPress: () => {
          const periodLabel =
            periodData.filingPeriod ||
            periodData.filingMonth ||
            "Current Period";
          const newAppId = useApplicationStore.getState().createApplication(
            "gst-filing",
            `GST Filing (${periodLabel})`,
            "GST",
            {
              gstin: periodData.gstin,
              businessName:
                periodData.tradeName ||
                periodData.businessName ||
                "Registered Business",
              filingPeriod: periodLabel,
              filingType: periodData.filingType || "GSTR-1",
              filingNature: periodData.filingNature || "Regular Return",
              financialYear: periodData.financialYear || "FY 2025-26",
              paymentStatus: "Payment Pending",
              paymentMethod: selectedMethod.toUpperCase(),
              filingId: filingId || undefined,
              taxableSales: periodData.taxableSales || "0",
              eligibleItc: periodData.eligibleItc || "0",
            },
            extractUploadedDocumentNames(documents),
            0,
            "Pending",
            false,
            filingId || undefined,
          );
          setCreatedAppId(newAppId);
          clearGstFilingDraft();
          setIsSubmitting(false);
          setCurrentStep(6);
        },
      },
    ],
  );
}
