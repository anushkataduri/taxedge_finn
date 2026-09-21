import { useState, useEffect, useRef, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  ComplianceFormData,
  ValidationErrors,
  validateComplianceForm,
} from "../validation/complianceSchema";
import {
  cleanGstinInput,
  isValidGstin,
} from "../utils/gstValidation";
import { submitComplianceRequest, SubmissionResult } from "../services/gstComplianceService";

const initialFormData: ComplianceFormData = {
  gstin: "",
  financialYear: "",
  requestType: "",
  purchaseDoc: null,
  salesDoc: null,
  gstr2bRef: "",
  reconciliationRemarks: "",
  noticeNumber: "",
  noticeIssueDate: "",
  replyDueDate: "",
  noticeDoc: null,
  noticeRemarks: "",
};

// In-memory draft store for fast reactive resume across navigation
let savedDraftCache: ComplianceFormData | null = null;

export function useComplianceForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<ComplianceFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasCheckedDraft, setHasCheckedDraft] = useState(false);

  // Check if draft exists on mount
  useEffect(() => {
    if (!hasCheckedDraft) {
      if (
        savedDraftCache &&
        (savedDraftCache.gstin ||
          savedDraftCache.financialYear ||
          savedDraftCache.requestType ||
          savedDraftCache.purchaseDoc ||
          savedDraftCache.noticeDoc)
      ) {
        setShowResumeModal(true);
      }
      setHasCheckedDraft(true);
    }
  }, [hasCheckedDraft]);

  // Auto-save draft on any change if fields are filled
  useEffect(() => {
    const isDirty = Boolean(
      formData.gstin ||
      formData.financialYear ||
      formData.requestType ||
      formData.purchaseDoc ||
      formData.salesDoc ||
      formData.noticeDoc ||
      formData.noticeNumber
    );

    if (isDirty) {
      savedDraftCache = formData;
    }
  }, [formData]);

  const resumeDraft = useCallback(() => {
    if (savedDraftCache) {
      setFormData(savedDraftCache);
    }
    setShowResumeModal(false);
  }, []);

  const discardDraft = useCallback(() => {
    savedDraftCache = null;
    setFormData(initialFormData);
    setErrors({});
    setShowResumeModal(false);
  }, []);

  const updateField = useCallback(
    <K extends keyof ComplianceFormData>(field: K, value: ComplianceFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }, []);

  // Instant GSTIN handling
  const handleGstinChange = useCallback(
    (text: string) => {
      const cleaned = cleanGstinInput(text);
      updateField("gstin", cleaned);

      // Instant validation feedback: only show error if full 15 chars and invalid
      if (cleaned.length === 15) {
        if (!isValidGstin(cleaned)) {
          setErrors((prev) => ({
            ...prev,
            gstin: "Invalid GSTIN format (e.g. 29AAAAA0000A1Z5)",
          }));
        } else {
          clearError("gstin");
        }
      } else {
        clearError("gstin");
      }
    },
    [updateField, clearError]
  );

  // Validate and open confirmation popup
  const handlePressSubmit = useCallback(() => {
    const { isValid, errors: validationErrors } = validateComplianceForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      Alert.alert(
        "Required Fields Missing",
        "Please fill in all required fields highlighted in red."
      );
      return;
    }

    // Open Confirmation Popup to prevent accidental submissions
    setShowConfirmModal(true);
  }, [formData]);

  // Execute submission
  const handleConfirmSubmit = useCallback(async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const result: SubmissionResult = await submitComplianceRequest(formData);

      if (result.success) {
        // Clear draft
        savedDraftCache = null;

        // Navigate to dedicated success screen
        router.replace({
          pathname: "/service/gst-compliance-success" as any,
          params: {
            referenceId: result.referenceId,
            requestType: formData.requestType,
            gstin: formData.gstin,
            submittedAt: result.submittedAt,
            estimatedResponse: result.estimatedResponse,
          },
        });
      } else {
        Alert.alert(
          "Submission Failed",
          result.error || "Unable to submit your request. Please check your internet connection and try again.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Retry", onPress: handleConfirmSubmit },
          ]
        );
      }
    } catch (err) {
      Alert.alert(
        "Network Error",
        "Please check your internet connection and retry.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Retry", onPress: handleConfirmSubmit },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, router]);

  return {
    formData,
    errors,
    isSubmitting,
    showConfirmModal,
    showResumeModal,
    setShowConfirmModal,
    setShowResumeModal,
    resumeDraft,
    discardDraft,
    updateField,
    clearError,
    handleGstinChange,
    handlePressSubmit,
    handleConfirmSubmit,
  };
}
