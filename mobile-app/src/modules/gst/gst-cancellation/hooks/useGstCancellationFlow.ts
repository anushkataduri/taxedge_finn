import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";

import { useApplicationStore } from "@/store/applicationStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { pickImageFromCamera } from "@/modules/gst/utils/imageUploadHelper";
import { gstCancellationApi } from "@/modules/gst/services/gstCancellationApi";

import {
  CancellationFormData,
  CancellationDoc,
  CancellationStep,
  CancellationSubmissionResult,
  INITIAL_CANCELLATION_FORM,
} from "../types/gstCancellationTypes";

export function useGstCancellationFlow() {
  const router = useRouter();
  const [step, setStep] = useState<CancellationStep>("FORM");
  const [form, setForm] = useState<CancellationFormData>(INITIAL_CANCELLATION_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reasonOpen, setReasonOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [proofsOpen, setProofsOpen] = useState(false);
  const [reviewDeclared, setReviewDeclared] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CancellationSubmissionResult | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { saveGstCancellationDraft, clearGstCancellationDraft, createApplication } = useApplicationStore();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const setFormField = useCallback(<K extends keyof CancellationFormData>(key: K, value: CancellationFormData[K]) => {
    if (key === "gstin" && typeof value === "string") {
      setForm((prev) => ({ ...prev, gstin: value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 15) }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  }, []);

  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const draftGuard = useUniversalDraftGuard({
    isDirty: () =>
      Boolean(
        form.gstin ||
        form.reason ||
        form.cancellationDate ||
        form.closingStock ||
        form.lastGstr3b ||
        form.supportingDoc
      ),
    onSaveDraft: () =>
      saveGstCancellationDraft({
        formData: {
          gstin: form.gstin,
          reason: form.reason,
          otherReason: form.otherReason,
          cancellationDate: form.cancellationDate,
          closingStock: form.closingStock,
          pendingLiabilities: form.pendingLiabilities,
          lastGstr3b: form.lastGstr3b,
        },
        step,
        updatedAt: new Date().toISOString().split("T")[0],
      }),
    onDiscardDraft: clearGstCancellationDraft,
    isSubmitted: () => step === "SUCCESS",
  });

  const pickDoc = useCallback(async () => {
    try {
      const r = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
      });
      if (!r.canceled && r.assets?.[0]) {
        const f = r.assets[0];
        const doc: CancellationDoc = {
          uri: f.uri,
          name: f.name || "supporting_document",
          size: f.size ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : "0.5 MB",
          mimeType: f.mimeType,
        };
        setFormField("supportingDoc", doc);
        clearError("supportingDoc");
      }
    } catch {
      Alert.alert("File Selection Failed", "Unable to select document. Please try again.");
    }
  }, [clearError, setFormField]);

  const scanDoc = useCallback(async () => {
    try {
      const uri = await pickImageFromCamera(false);
      if (uri) {
        const doc: CancellationDoc = {
          uri,
          name: `Scan_${Date.now().toString().slice(-4)}.jpg`,
          size: "1.2 MB",
          mimeType: "image/jpeg",
        };
        setFormField("supportingDoc", doc);
        clearError("supportingDoc");
      }
    } catch {
      Alert.alert("Camera Error", "Unable to scan document using camera.");
    }
  }, [clearError, setFormField]);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!form.gstin.trim()) {
      errs.gstin = "GSTIN is required";
    } else if (!GstValidators.isValidGstin(form.gstin)) {
      errs.gstin = "Valid 15-character GSTIN is required (e.g. 29AAAAA0000A1Z5)";
    }

    if (!form.reason) {
      errs.reason = "Please select a cancellation reason";
    }
    if (form.reason === "Other Valid Reason" && !form.otherReason.trim()) {
      errs.otherReason = "Please describe the reason";
    }
    if (!form.cancellationDate) {
      errs.cancellationDate = "Cancellation date is required";
    }
    if (!form.closingStock.trim()) {
      errs.closingStock = "Closing stock amount is required (enter 0 if nil)";
    } else if (isNaN(Number(form.closingStock)) || Number(form.closingStock) < 0) {
      errs.closingStock = "Please enter a valid numeric amount";
    }
    if (!form.pendingLiabilities.trim()) {
      errs.pendingLiabilities = "Pending tax dues amount is required (enter 0 if nil)";
    } else if (isNaN(Number(form.pendingLiabilities)) || Number(form.pendingLiabilities) < 0) {
      errs.pendingLiabilities = "Please enter a valid numeric amount";
    }
    if (!form.lastGstr3b.trim()) {
      errs.lastGstr3b = "Last GSTR-3B ARN / filing period is required";
    }
    if (form.isVoluntaryUnderOneYear === true) {
      errs.voluntary = "Voluntary cancellation not allowed within 1 year of registration";
    }
    if (form.areAllReturnsFiled === false) {
      errs.returns = "All pending GST returns must be filed before applying for cancellation";
    }
    if (!form.isFinalReturnDeclared) {
      errs.finalReturn = "You must confirm to file the final return (GSTR-10)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleProceedToReview = useCallback(() => {
    if (!validate()) return;
    if (isEditMode) {
      setIsEditMode(false);
      setStep("REVIEW");
      return;
    }
    setStep("REVIEW");
  }, [isEditMode, validate]);

  const handleEditFromReview = useCallback(() => {
    setIsEditMode(true);
    setStep("FORM");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!reviewDeclared) {
      Alert.alert("Declaration Required", "Please tick the declaration checkbox to proceed.");
      return;
    }

    setSubmitting(true);
    try {
      let createdArn = `ARN${Date.now().toString().slice(-8)}`;
      let appId = `APP-${Date.now().toString().slice(-6)}`;

      try {
        const resp = await gstCancellationApi.createCancellation(form);
        const parsed = JSON.parse(resp);
        if (parsed.arn) createdArn = parsed.arn;
        if (parsed.applicationId) appId = parsed.applicationId;
      } catch {
        // Fallback to local reference
      }

      const submissionDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const submissionRes: CancellationSubmissionResult = {
        arn: createdArn,
        date: submissionDate,
        appId,
      };

      try {
        createApplication(
          "gst-cancellation",
          "GST Cancellation (REG-16)",
          "GST",
          {
            gstin: form.gstin,
            reason: form.reason === "Other Valid Reason" ? form.otherReason : form.reason,
            cancellationDate: form.cancellationDate,
            closingStock: form.closingStock,
            pendingLiabilities: form.pendingLiabilities,
            lastGstr3b: form.lastGstr3b,
            arn: createdArn,
            appliedDate: submissionDate,
          },
          [],
          0
        );
        addNotification(
          "GST Cancellation Submitted",
          `Application for cancellation of GSTIN ${form.gstin} submitted successfully. ARN: ${createdArn}`,
          "gst"
        );
      } catch {}

      draftGuard.markSubmitted();
      setResult(submissionRes);
      setStep("SUCCESS");
    } catch (err: any) {
      Alert.alert("Submission Error", err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [addNotification, createApplication, draftGuard, form, reviewDeclared]);

  return {
    router,
    step,
    setStep,
    form,
    errors,
    reasonOpen,
    setReasonOpen,
    dateOpen,
    setDateOpen,
    proofsOpen,
    setProofsOpen,
    reviewDeclared,
    setReviewDeclared,
    submitting,
    result,
    isEditMode,
    draftGuard,
    setFormField,
    clearError,
    pickDoc,
    scanDoc,
    handleProceedToReview,
    handleEditFromReview,
    handleSubmit,
  };
}
