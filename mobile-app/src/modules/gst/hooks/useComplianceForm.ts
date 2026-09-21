import { useState, useEffect, useRef, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useAuthStore } from "@/store/authStore";
import { addDraftToIndex, removeDraftFromIndex } from "@/shared/hooks/useServiceDraft";

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

function getDraftKey(mobile: string) {
  return `@taxedge_draft_${mobile}_gst-compliance`;
}

function getCleanMobile(): string {
  const authState = useAuthStore.getState();
  const mobile =
    authState.customer?.mobile ||
    authState.authenticatedUser?.mobileNumber ||
    authState.mobileNumber;
  return mobile ? String(mobile).replace(/\D/g, "") : "";
}

export function useComplianceForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<ComplianceFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasCheckedDraft, setHasCheckedDraft] = useState(false);

  // Check if draft exists on mount (from AsyncStorage)
  useEffect(() => {
    if (!hasCheckedDraft) {
      const check = async () => {
        try {
          const mobile = getCleanMobile();
          if (!mobile) return;
          const raw = await AsyncStorage.getItem(getDraftKey(mobile));
          if (raw) {
            const draft = JSON.parse(raw);
            const saved: ComplianceFormData = draft.formData || {};
            if (
              saved.gstin ||
              saved.financialYear ||
              saved.requestType ||
              saved.purchaseDoc ||
              saved.noticeDoc
            ) {
              setShowResumeModal(true);
            }
          }
        } catch {
          // ignore
        }
        setHasCheckedDraft(true);
      };
      check();
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

    if (isDirty && hasCheckedDraft) {
      const mobile = getCleanMobile();
      if (mobile) {
        addDraftToIndex(mobile, "gst-compliance");
        AsyncStorage.setItem(
          getDraftKey(mobile),
          JSON.stringify({
            serviceKey: "gst-compliance",
            serviceName: "GST Compliance",
            category: "GST",
            step: 0,
            formData,
            updatedAt: new Date().toISOString().split("T")[0],
          })
        ).catch(() => {});
      }
    }
  }, [formData, hasCheckedDraft]);

  const resumeDraft = useCallback(async () => {
    try {
      const mobile = getCleanMobile();
      if (!mobile) return;
      const raw = await AsyncStorage.getItem(getDraftKey(mobile));
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.formData) {
          setFormData(draft.formData);
        }
      }
    } catch {
      // ignore
    }
    setShowResumeModal(false);
  }, []);

  const discardDraft = useCallback(() => {
    const mobile = getCleanMobile();
    if (mobile) {
      removeDraftFromIndex(mobile, "gst-compliance");
      AsyncStorage.removeItem(getDraftKey(mobile)).catch(() => {});
    }
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
        // Clear draft from AsyncStorage
        const mobile = getCleanMobile();
        if (mobile) {
          removeDraftFromIndex(mobile, "gst-compliance");
          AsyncStorage.removeItem(getDraftKey(mobile)).catch(() => {});
        }

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
