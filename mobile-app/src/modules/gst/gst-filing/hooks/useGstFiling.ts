/**
 * Custom Hook: useGstFiling
 * Manages the multi-step GST Filing workflow, state synchronization,
 * REST API persistence, drafts, and step progression.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { useApplicationStore } from "@/store/applicationStore";
import { gstApi } from "@/modules/gst/services/gstApi";
import { useGstFilingForm } from "@/modules/gst/gst-filing/hooks/useGstFilingForm";
import { useGstFilingRestore } from "@/modules/gst/gst-filing/hooks/useGstFilingRestore";
import {
  mapDtoToPeriodData,
  mapDtoToFilingDocuments,
  resolveTargetFilingId,
} from "@/modules/gst/gst-filing/hooks/gstFilingHelpers";
import {
  submitPeriodStep,
  submitDocumentsStep,
  submitReviewStep,
  promptPayLaterSubmission,
} from "@/modules/gst/gst-filing/hooks/gstFilingStepHandlers";

export { mapDtoToPeriodData, mapDtoToFilingDocuments };

export function useGstFiling() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    appId?: string;
    step?: string;
    filingId?: string;
    id?: string;
  }>();

  const [currentStep, setCurrentStep] = useState(0);
  const [filingId, setFilingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppId, setCreatedAppId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditStep = useCallback((stepIndex: number) => {
    setIsEditMode(true);
    setCurrentStep(stepIndex);
  }, []);

  const {
    periodData,
    setPeriodData,
    periodErrors,
    setPeriodErrors,
    documents,
    setDocuments,
    validatePeriodStep,
    handleUpdateDocuments,
    requiredDocs,
    missingDocsCount,
    uploadedDocsCount,
  } = useGstFilingForm(createdAppId);

  // Payment State
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");

  // Store access
  const gstFilingDraft = useApplicationStore((state) => state.gstFilingDraft);
  const saveGstFilingDraft = useApplicationStore((state) => state.saveGstFilingDraft);
  const clearGstFilingDraft = useApplicationStore((state) => state.clearGstFilingDraft);

  // Universal Draft Guard Hook
  const {
    showDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () =>
      Boolean(
        periodData.periodType ||
          periodData.financialYear ||
          periodData.filingPeriod ||
          periodData.filingMonth ||
          periodData.gstin ||
          periodData.filingType ||
          documents.some((d) => Boolean(d.fileUri)),
      ),
    onSaveDraft: () => {
      saveGstFilingDraft({
        id: "gst-filing-draft",
        stepIndex: currentStep,
        periodData,
        documents,
        createdFilingId: filingId || undefined,
        updatedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    },
    onDiscardDraft: () => {
      clearGstFilingDraft();
    },
    isSubmitted: () => currentStep >= 4,
  });

  // Restore existing application or draft on mount
  useGstFilingRestore({
    params,
    setFilingId,
    setCreatedAppId,
    setCurrentStep,
    setPeriodData,
    setDocuments,
  });

  const [isFetchingReview, setIsFetchingReview] = useState<boolean>(false);
  const lastFetchedReviewIdRef = useRef<string | null>(null);
  const periodDataRef = useRef(periodData);
  periodDataRef.current = periodData;
  const filingIdRef = useRef(filingId);
  filingIdRef.current = filingId;

  const filingGstinRef = useRef<string | null>(null);

  // Bind filingId to its associated GSTIN
  useEffect(() => {
    if (filingId && periodData.gstin) {
      filingGstinRef.current = periodData.gstin.trim().toUpperCase();
    }
  }, [filingId, periodData.gstin]);

  // If user modifies GSTIN, ensure previous filing ID belonging to other GSTIN is reset
  useEffect(() => {
    const clean = periodData.gstin ? periodData.gstin.trim().toUpperCase() : "";
    if (clean && filingGstinRef.current && clean !== filingGstinRef.current) {
      console.log(`[Filing] GSTIN changed from ${filingGstinRef.current} to ${clean}. Resetting session.`);
      setFilingId(null);
      filingGstinRef.current = null;
    }
  }, [periodData.gstin]);

  const getTargetFilingId = useCallback(
    (explicitId?: string): string => {
      const applications = useApplicationStore.getState().applications;
      const currentGstin = periodDataRef.current?.gstin;
      return resolveTargetFilingId(
        [
          explicitId,
          filingIdRef.current,
          (gstFilingDraft as any)?.createdFilingId,
          (periodDataRef.current as any)?.filingId,
          (periodDataRef.current as any)?.gstfilingId,
          params.filingId,
          params.id,
          params.appId?.startsWith("FIL") ? params.appId : undefined,
        ],
        applications,
        currentGstin,
      );
    },
    [gstFilingDraft, params.appId, params.filingId, params.id],
  );

  // Fetch persisted filing data from backend
  const fetchFilingDetails = useCallback(
    async (idToFetch?: string) => {
      let targetId = getTargetFilingId(idToFetch);

      if (!targetId && periodDataRef.current.gstin) {
        try {
          const filings = await gstApi.fetchFilings(periodDataRef.current.gstin);
          if (filings && filings.length > 0) {
            const sorted = [...filings].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            );
            const latest = sorted[sorted.length - 1];
            targetId = latest.gstfilingId || latest.id || "";
          }
        } catch (fetchErr) {
          console.debug("[FilingDetails] Could not fetch filings by GSTIN:", fetchErr);
        }
      }

      if (!targetId) return;

      setIsFetchingReview(true);
      try {
        const dbFiling = await gstApi.getFilingById(targetId);
        if (dbFiling) {
          const mapped = mapDtoToPeriodData(dbFiling);
          setPeriodData((prev) => ({
            ...prev,
            ...mapped,
            filingId: targetId,
          }));
          setFilingId(targetId);
        }
      } catch (err: any) {
        console.warn("Could not retrieve GST filing details from DB:", err?.message || err);
      }

      try {
        const dbDocs = await gstApi.getFilingDocuments(targetId);
        if (dbDocs) {
          setDocuments((prev) => mapDtoToFilingDocuments(dbDocs, prev));
        }
      } catch (docErr: any) {
        console.log(`[DB-FETCH] No documents found in DB for filing ID: ${targetId}`);
      } finally {
        setIsFetchingReview(false);
      }
    },
    [getTargetFilingId, setPeriodData, setDocuments],
  );

  // Automatically retrieve from database when entering Review step (currentStep === 2)
  useEffect(() => {
    if (currentStep === 2) {
      const activeId = getTargetFilingId();
      if (activeId && lastFetchedReviewIdRef.current === activeId) {
        return;
      }
      lastFetchedReviewIdRef.current = activeId || "fetched";
      fetchFilingDetails(activeId);
    } else {
      lastFetchedReviewIdRef.current = null;
    }
  }, [currentStep, fetchFilingDetails, getTargetFilingId]);

  const getScreenTitle = useCallback(() => {
    switch (currentStep) {
      case 0:
        return "GST Filing Period";
      case 1:
        return "Filing Documents";
      case 2:
        return "Filing Review & Computation";
      case 3:
        return "Complete Payment";
      case 4:
        return "Payment Successful";
      case 5:
        return "Payment Receipt";
      default:
        return "Application Status";
    }
  }, [currentStep]);

  const getButtonText = useCallback(() => {
    if (isEditMode && (currentStep === 0 || currentStep === 1)) {
      return "Update & Review";
    }
    switch (currentStep) {
      case 0:
        return "Continue to Documents";
      case 1:
        return "Continue to Review";
      case 2:
        return "Proceed to Submit →";
      case 3:
        return "Confirm & Pay";
      default:
        return "";
    }
  }, [currentStep, isEditMode]);

  const validatePaymentStep = useCallback((): boolean => {
    if (selectedMethod === "upi") {
      if (!GstValidators.isValidUpi(upiId)) {
        setUpiError("Enter a valid UPI ID (e.g. yourname@bank / mobile@upi)");
        Alert.alert(
          "Invalid UPI ID",
          "Please enter a valid UPI ID to complete payment.",
        );
        return false;
      }
    }
    setUpiError("");
    return true;
  }, [selectedMethod, upiId]);

  const handleBack = useCallback(() => {
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep(2);
      return;
    }
    if (currentStep === 6 || currentStep === 4) {
      router.back();
    } else if (currentStep === 5) {
      setCurrentStep(4);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  }, [currentStep, router, isEditMode]);

  const handleContinue = useCallback(async () => {
    if (currentStep === 0) {
      if (!validatePeriodStep()) return;
      await submitPeriodStep({
        periodData,
        targetFilingId: getTargetFilingId(),
        isEditMode,
        setFilingId,
        setCurrentStep,
        setIsEditMode,
        setIsSubmitting,
      });
      return;
    }

    if (currentStep === 1) {
      await submitDocumentsStep({
        targetFilingId: getTargetFilingId(),
        periodData,
        documents,
        isEditMode,
        setFilingId,
        setDocuments,
        setCurrentStep,
        setIsEditMode,
        setIsSubmitting,
      });
      return;
    }

    if (currentStep === 2) {
      await submitReviewStep({
        missingDocsCount,
        filingId,
        periodData,
        setCurrentStep,
        setIsSubmitting,
      });
      return;
    }

    if (currentStep === 3) {
      if (!validatePaymentStep()) return;
      setIsSubmitting(true);
      promptPayLaterSubmission({
        periodData,
        selectedMethod,
        filingId,
        documents,
        setCreatedAppId,
        clearGstFilingDraft,
        setIsSubmitting,
        setCurrentStep,
      });
    }
  }, [
    currentStep,
    validatePeriodStep,
    validatePaymentStep,
    periodData,
    filingId,
    documents,
    missingDocsCount,
    selectedMethod,
    setDocuments,
    clearGstFilingDraft,
    isEditMode,
    getTargetFilingId,
  ]);

  return {
    currentStep,
    setCurrentStep,
    isSubmitting,
    periodData,
    setPeriodData,
    periodErrors,
    setPeriodErrors,
    documents,
    selectedMethod,
    setSelectedMethod,
    upiId,
    setUpiId,
    upiError,
    setUpiError,
    createdAppId,
    filingId,
    showDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
    getScreenTitle,
    getButtonText,
    handleBack,
    handleContinue,
    handleUpdateDocuments,
    requiredDocs,
    missingDocsCount,
    uploadedDocsCount,
    isEditMode,
    handleEditStep,
    isFetchingReview,
    fetchFilingDetails,
  };
}
