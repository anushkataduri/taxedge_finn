import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ComplianceFormData,
  ValidationErrors,
  validateComplianceForm,
} from "@/modules/gst/validation/complianceSchema";
import {
  cleanGstinInput,
  isValidGstin,
} from "@/modules/gst/utils/gstValidation";
import {
  submitComplianceRequest,
  SubmissionResult,
} from "@/modules/gst/services/gstComplianceService";
import { useAuthStore } from "@/store/authStore";
import { addDraftToIndex, removeDraftFromIndex } from "@/shared/hooks/useServiceDraft";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";

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

function getDraftKey(mobile: string): string {
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

  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = Form, 1 = Review
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<ComplianceFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [hasCheckedDraft, setHasCheckedDraft] = useState<boolean>(false);

  // Check if draft exists on mount and silently restore without popup
  useEffect(() => {
    if (!hasCheckedDraft) {
      const checkDraft = async () => {
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
              saved.noticeDoc ||
              saved.noticeNumber
            ) {
              setFormData((prev) => ({ ...prev, ...saved }));
            }
          }
        } catch {
          // ignore draft read failure
        }
        setHasCheckedDraft(true);
      };
      checkDraft();
    }
  }, [hasCheckedDraft]);

  // Universal Draft Guard Integration
  const isDirty = useCallback((): boolean => {
    return Boolean(
      formData.gstin ||
      formData.financialYear ||
      formData.requestType ||
      formData.purchaseDoc ||
      formData.salesDoc ||
      formData.noticeDoc ||
      formData.noticeNumber
    );
  }, [formData]);

  const saveCurrentDraft = useCallback(async () => {
    const mobile = getCleanMobile();
    if (mobile) {
      addDraftToIndex(mobile, "gst-compliance");
      await AsyncStorage.setItem(
        getDraftKey(mobile),
        JSON.stringify({
          serviceKey: "gst-compliance",
          serviceName: "GST Compliance",
          category: "GST",
          step: currentStep,
          formData,
          updatedAt: new Date().toISOString().split("T")[0],
        })
      );
    }
  }, [formData, currentStep]);

  const clearCurrentDraft = useCallback(async () => {
    const mobile = getCleanMobile();
    if (mobile) {
      removeDraftFromIndex(mobile, "gst-compliance");
      await AsyncStorage.removeItem(getDraftKey(mobile));
    }
    setFormData(initialFormData);
    setErrors({});
    setCurrentStep(0);
    setIsEditMode(false);
  }, []);

  const draftGuard = useUniversalDraftGuard({
    isDirty,
    onSaveDraft: saveCurrentDraft,
    onDiscardDraft: clearCurrentDraft,
    isSubmitted: () => false,
  });

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

  // Instant GSTIN sanitization and validation
  const handleGstinChange = useCallback(
    (text: string) => {
      const cleaned = cleanGstinInput(text);
      updateField("gstin", cleaned);

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

  // Edit action triggered from Review Step
  const handleEditStep = useCallback((_section?: string) => {
    setIsEditMode(true);
    setCurrentStep(0);
  }, []);

  // Continue or Save & Review action
  const handleContinue = useCallback(() => {
    if (currentStep === 0) {
      const { isValid, errors: validationErrors } = validateComplianceForm(formData);
      if (!isValid) {
        setErrors(validationErrors);
        Alert.alert(
          "Required Fields Missing",
          "Please fill in all required fields highlighted in red."
        );
        return;
      }

      if (isEditMode) {
        Alert.alert("Changes Saved", "Your details have been updated.");
        setIsEditMode(false);
      }

      setCurrentStep(1);
    } else {
      setShowConfirmModal(true);
    }
  }, [currentStep, isEditMode, formData]);

  const handleBack = useCallback(() => {
    if (currentStep === 1) {
      setCurrentStep(0);
    } else {
      router.back();
    }
  }, [currentStep, router]);

  // Execute backend submission
  const handleConfirmSubmit = useCallback(async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const result: SubmissionResult = await submitComplianceRequest(formData);

      if (result.success) {
        const mobile = getCleanMobile();
        if (mobile) {
          removeDraftFromIndex(mobile, "gst-compliance");
          AsyncStorage.removeItem(getDraftKey(mobile)).catch(() => {});
        }

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
          result.error || "Unable to submit your request. Please check your connection and retry.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Retry", onPress: handleConfirmSubmit },
          ]
        );
      }
    } catch {
      Alert.alert(
        "Network Error",
        "Could not communicate with the server. Please verify your internet connection.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Retry", onPress: handleConfirmSubmit },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, router]);

  const getButtonText = useCallback((): string => {
    if (isEditMode && currentStep === 0) {
      return "Update & Review";
    }
    if (currentStep === 0) {
      return "Continue to Review";
    }
    return "Submit Compliance Request";
  }, [currentStep, isEditMode]);

  return {
    currentStep,
    setCurrentStep,
    isEditMode,
    formData,
    errors,
    isSubmitting,
    showConfirmModal,
    setShowConfirmModal,
    draftGuard,
    updateField,
    clearError,
    handleGstinChange,
    handleEditStep,
    handleContinue,
    handleBack,
    handleConfirmSubmit,
    getButtonText,
  };
}
