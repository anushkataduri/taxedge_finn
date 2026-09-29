import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { FilingDocItem } from "../components/GstFilingDocumentsStep/GstFilingDocumentsStep";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { useApplicationStore } from "@/store/applicationStore";
import { gstApi } from "@/modules/gst/services/gstApi";
import { useGstFilingForm } from "./useGstFilingForm";

function mapDocNameToEnum(name: string): string {
  if (name.includes("Sales Invoices")) return "SALES_INVOICE";
  if (name.includes("Purchase Invoices")) return "PURCHASE_INVOICES";
  if (name.includes("GSTR-2B")) return "GSTR_2B_ITC_STATEMENT";
  if (name.includes("Credit Notes")) return "CREDIT_NOTES";
  if (name.includes("Debit Notes")) return "DEBIT_NOTES";
  if (name.includes("E-Invoice")) return "E_INVOICE_DATA";
  if (name.includes("E-Way Bill")) return "E_WAY_BILL_DATA";
  if (name.includes("Expense Invoices")) return "EXPENSE_INVOICES_AND_VOUCHERS";
  if (name.includes("Bank Statement")) return "BANK_STATEMENT";
  if (name.includes("Previous GST Returns")) return "PREVIOUS_GST_RETURNS";
  if (name.includes("Previous Filing Acknowledgement"))
    return "PREVIOUS_FILING_ACKNOWLEDGEMENT";
  return "OTHER_SUPPORTING_DOCUMENTS";
}

function buildFilingPayload(periodData: any, isManualEstimatesOnly = false) {
  const freq = periodData.periodType?.toUpperCase().replace(" ", "_");
  const rawReturn = periodData.filingType?.split(" ")[0].replace("-", "_");
  const isNil = periodData.filingNature === "Nil Return";
  const isEstimates =
    isManualEstimatesOnly || periodData.calculationMethod === "manual_estimates";

  return {
    gstin: periodData.gstin,
    financialYear: periodData.financialYear?.replace("FY ", "") || "2025-26",
    filingPeriod: periodData.filingPeriod || periodData.filingMonth,
    filingFrequency: freq === "ANNUAL" ? "ANNUAL_FINANCIAL_YEAR" : freq,
    returnType: rawReturn,
    filingType: isNil ? "NIL_RETURN" : "REGULAR",
    taxCalculationMethod: isEstimates
      ? "ESTIMATION_FIGURES"
      : "TAXEDGE_CA_CALCULATION",
    estimatedTaxableSales: isEstimates
      ? Number(periodData.taxableSales || periodData.turnover || 0)
      : null,
    estimatedTaxablePurchases: isEstimates
      ? Number(periodData.taxablePurchases || 0)
      : null,
    estimatedEligibleItc: isEstimates
      ? Number(periodData.eligibleItc || 0)
      : null,
  };
}

export function useGstFiling() {
  const router = useRouter();
  const params = useLocalSearchParams<{ appId?: string; step?: string }>();

  const [currentStep, setCurrentStep] = useState(0);
  const [filingId, setFilingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppId, setCreatedAppId] = useState("");

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
  const saveGstFilingDraft = useApplicationStore(
    (state) => state.saveGstFilingDraft,
  );
  const clearGstFilingDraft = useApplicationStore(
    (state) => state.clearGstFilingDraft,
  );

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
  useEffect(() => {
    const restoreTimer = setTimeout(() => {
      if (params.appId) {
        const existingApp = useApplicationStore
          .getState()
          .applications.find((a) => a.id === params.appId);
        if (existingApp) {
          setCreatedAppId(existingApp.id);
          const fData = (existingApp.formData || {}) as Record<string, any>;
          setPeriodData((prev) => ({
            ...prev,
            gstin: fData.gstin || prev.gstin,
            businessName:
              fData.businessName ||
              fData.tradeName ||
              fData.applicantName ||
              prev.businessName,
            tradeName: fData.tradeName || fData.businessName || prev.tradeName,
            taxpayerScheme: fData.taxpayerScheme || prev.taxpayerScheme,
            filingNature: fData.filingNature || prev.filingNature,
            financialYear: fData.financialYear || prev.financialYear,
            filingPeriod:
              fData.filingPeriod || fData.filingMonth || prev.filingPeriod,
            filingMonth:
              fData.filingMonth || fData.filingPeriod || prev.filingMonth,
            filingType: fData.filingType || prev.filingType,
            filingFrequency: fData.filingFrequency || prev.periodType,
            periodType: fData.filingFrequency || prev.periodType,
            taxableSales: fData.turnover || prev.taxableSales,
            turnover: fData.turnover || prev.turnover,
            eligibleItc: fData.eligibleItc || prev.eligibleItc,
          }));

          if (
            Array.isArray(existingApp.documents) &&
            existingApp.documents.length > 0
          ) {
            const syncPrevDocs = (
              docs: readonly FilingDocItem[],
              appDocs: readonly any[],
              idx = 0,
              acc: FilingDocItem[] = [],
            ): FilingDocItem[] => {
              if (idx >= docs.length) return acc;
              const initDoc = docs[idx];
              const matched = appDocs.find(
                (d) =>
                  d.name?.toLowerCase() === initDoc.name?.toLowerCase() ||
                  (d as any).id === initDoc.id,
              );
              acc.push(
                matched && matched.status === "Uploaded"
                  ? {
                      ...initDoc,
                      fileUri:
                        matched.fileUri ||
                        "https://taxedge.in/docs/" + initDoc.id,
                      fileName: matched.name,
                    }
                  : initDoc,
              );
              return syncPrevDocs(docs, appDocs, idx + 1, acc);
            };

            setDocuments((prevDocs) =>
              syncPrevDocs(prevDocs, existingApp.documents),
            );
          }

          if (params.step) {
            const stepNum = parseInt(params.step, 10);
            if (!isNaN(stepNum)) setCurrentStep(stepNum);
          } else {
            setCurrentStep(2);
          }
          return;
        }
      }

      if (gstFilingDraft) {
        if (gstFilingDraft.periodData) {
          setPeriodData((prev) => ({ ...prev, ...gstFilingDraft.periodData }));
        }
        if (gstFilingDraft.documents && gstFilingDraft.documents.length > 0) {
          setDocuments(gstFilingDraft.documents as FilingDocItem[]);
        }
        if (
          typeof gstFilingDraft.stepIndex === "number" &&
          gstFilingDraft.stepIndex < 4
        ) {
          setCurrentStep(gstFilingDraft.stepIndex);
        }
      }
    }, 0);

    return () => clearTimeout(restoreTimer);
  }, [gstFilingDraft, params.appId, params.step, setDocuments, setPeriodData]);

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
  }, [currentStep]);

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
    if (currentStep === 6 || currentStep === 4) {
      router.back();
    } else if (currentStep === 5) {
      setCurrentStep(4);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  }, [currentStep, router]);

  const handleContinue = useCallback(async () => {
    if (currentStep === 0) {
      if (!validatePeriodStep()) return;

      setIsSubmitting(true);
      try {
        const payload = buildFilingPayload(periodData);

        if (filingId) {
          await gstApi.updateFiling(filingId, payload);
          setCurrentStep(1);
        } else {
          await gstApi.createFiling(payload);
          const filings = await gstApi.fetchFilings(periodData.gstin);
          if (filings && filings.length > 0) {
            const sortedFilings = [...filings].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            );
            const latest = sortedFilings[sortedFilings.length - 1];
            setFilingId(latest.id);
          }
          setCurrentStep(1);
        }
      } catch (err: any) {
        Alert.alert(
          "Filing Notice",
          err?.message || "Failed to initialize filing session. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 1) {
      if (!filingId) {
        Alert.alert("Notice", "Filing session not found. Please re-check period details.");
        setCurrentStep(0);
        return;
      }
      setIsSubmitting(true);
      try {
        const docsToUpload = documents.filter(
          (d) => d.fileUri && !(d as any).uploadedToBackend,
        );
        const uploadRecursively = async (
          list: readonly FilingDocItem[],
          idx = 0,
        ): Promise<void> => {
          if (idx >= list.length) return;
          const doc = list[idx];
          const enumType = mapDocNameToEnum(doc.name);
          await gstApi.uploadFilingDocument(
            filingId,
            enumType,
            doc.fileUri!,
            doc.fileName || "doc.jpg",
          );
          (doc as any).uploadedToBackend = true;
          return uploadRecursively(list, idx + 1);
        };
        await uploadRecursively(docsToUpload);
        setDocuments([...documents]);
        setCurrentStep(2);
      } catch (uploadErr: any) {
        Alert.alert(
          "Notice",
          uploadErr?.message || "Documents upload incomplete. Proceeding to review.",
        );
        setCurrentStep(2);
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 2) {
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
          const payload = buildFilingPayload(periodData, true);
          await gstApi.updateFiling(filingId, payload);
        } catch {
          // Continue gracefully
        } finally {
          setIsSubmitting(false);
        }
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!validatePaymentStep()) return;
      setIsSubmitting(true);

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
                (() => {
                  const extractUploadedNames = (
                    list: readonly FilingDocItem[],
                    idx = 0,
                    acc: string[] = [],
                  ): string[] => {
                    if (idx >= list.length) return acc;
                    const d = list[idx];
                    if (d.fileUri) acc.push(d.name);
                    return extractUploadedNames(list, idx + 1, acc);
                  };
                  return extractUploadedNames(documents);
                })(),
                0,
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
  };
}
