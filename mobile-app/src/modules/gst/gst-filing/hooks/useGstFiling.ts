import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { FilingDocItem } from "../components/GstFilingDocumentsStep/GstFilingDocumentsStep";
import { GstFilingPeriodData } from "../components/GstFilingPeriodStep/GstFilingPeriodStep";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { useApplicationStore } from "@/store/applicationStore";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { tokenManager, JwtUtils } from "@/core/authentication/tokenManager";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { gstApi } from "@/modules/gst/services/gstApi";
import { useGstFilingForm } from "./useGstFilingForm";

const getResolvedCustomerId = async (): Promise<string> => {
  try {
    const token = await tokenManager.getAccessToken();
    if (token) {
      const payload = JwtUtils.decodePayload(token);
      if (payload?.sub && typeof payload.sub === "string" && payload.sub.trim()) {
        return payload.sub.trim();
      }
    }
  } catch {}

  try {
    const authState = useAuthStore.getState();
    const custId =
      authState.customer?.customerId ||
      authState.authenticatedUser?.customerId ||
      (authState.authenticatedUser as any)?.custId ||
      (authState.customer as any)?.custId ||
      "";
    if (custId && String(custId).trim()) {
      return String(custId).trim();
    }
  } catch {}

  try {
    const u = authStorage.getUser();
    const s = authStorage.getSession();
    const custId = u?.customerId || (u as any)?.custId || (s as any)?.activeCustId || "";
    if (custId && String(custId).trim()) {
      return String(custId).trim();
    }
  } catch {}

  return "";
};

const parseFilingNumber = (val: any): number => {
  if (typeof val === "number") return isNaN(val) ? 0 : Math.round(val);
  if (typeof val === "string") {
    const cleaned = val.replace(/[^\d.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.round(parsed);
  }
  return 0;
};

function buildFilingPayload(periodData: any, customerId?: string, isManualEstimatesOnly = false) {
  const rawFreq = (periodData.periodType || "Quarterly").toUpperCase().replace(/\s+/g, "_");
  let filingFrequency = "QUARTERLY";
  if (rawFreq.includes("ANNUAL")) filingFrequency = "ANNUAL_FINANCIAL_YEAR";
  else if (rawFreq.includes("MONTH")) filingFrequency = "MONTHLY";
  else filingFrequency = "QUARTERLY";

  // Backend ReturnType only accepts GSTR_1 or GSTR_3B
  const rawReturn = String(periodData.filingType || "GSTR-1").toUpperCase();
  const returnType = (rawReturn.includes("3B") || rawReturn.includes("3_B")) ? "GSTR_3B" : "GSTR_1";

  const isNil = periodData.filingNature === "Nil Return";
  const isEstimates =
    isManualEstimatesOnly || periodData.calculationMethod === "manual_estimates";

  const financialYear = (periodData.financialYear || "2025-26").replace(/^FY\s*/i, "").trim();
  const filingPeriod = periodData.filingPeriod || periodData.filingMonth || "Q3 (Oct-Dec 2025)";

  return {
    gstin: periodData.gstin,
    customerId: customerId || periodData.customerId || "",
    financialYear,
    filingPeriod,
    filingFrequency,
    returnType,
    filingType: isNil ? "NIL_RETURN" : "REGULAR",
    taxCalculationMethod: isEstimates
      ? "ESTIMATION_FIGURES"
      : "TAXEDGE_CA_CALCULATION",
    estimatedTaxableSales: isEstimates
      ? parseFilingNumber(periodData.taxableSales || periodData.turnover)
      : null,
    estimatedTaxablePurchases: isEstimates
      ? parseFilingNumber(periodData.taxablePurchases)
      : null,
    estimatedEligibleItc: isEstimates
      ? parseFilingNumber(periodData.eligibleItc)
      : null,
  };
}

export const mapDtoToPeriodData = (dto: any): Partial<GstFilingPeriodData> => {
  if (!dto) return {};

  const freq =
    dto.filingFrequency === "MONTHLY"
      ? "Monthly"
      : dto.filingFrequency === "ANNUAL_FINANCIAL_YEAR"
        ? "Annual"
        : "Quarterly";

  const retType =
    dto.returnType === "GSTR_3B"
      ? "GSTR-3B (Monthly Summary Return)"
      : "GSTR-1 (Outward Supplies Return)";

  const filNature =
    dto.filingType === "NIL_RETURN" ? "Nil Return" : "Regular Return";

  const calcMethod =
    dto.taxCalculationMethod === "ESTIMATION_FIGURES"
      ? "manual_estimates"
      : "ca_assisted";

  const fy = dto.financialYear
    ? String(dto.financialYear).startsWith("FY")
      ? String(dto.financialYear)
      : `FY ${dto.financialYear}`
    : undefined;

  return {
    gstin: dto.gstin || undefined,
    financialYear: fy,
    filingPeriod: dto.filingPeriod || undefined,
    filingMonth: dto.filingPeriod || undefined,
    periodType: freq,
    filingType: retType,
    filingNature: filNature as any,
    calculationMethod: calcMethod as any,
    taxableSales:
      dto.estimatedTaxableSales !== null && dto.estimatedTaxableSales !== undefined
        ? String(dto.estimatedTaxableSales)
        : undefined,
    turnover:
      dto.estimatedTaxableSales !== null && dto.estimatedTaxableSales !== undefined
        ? String(dto.estimatedTaxableSales)
        : undefined,
    taxablePurchases:
      dto.estimatedTaxablePurchases !== null && dto.estimatedTaxablePurchases !== undefined
        ? String(dto.estimatedTaxablePurchases)
        : undefined,
    eligibleItc:
      dto.estimatedEligibleItc !== null && dto.estimatedEligibleItc !== undefined
        ? String(dto.estimatedEligibleItc)
        : undefined,
  };
};

export const mapDtoToFilingDocuments = (
  dto: any,
  existingDocs: FilingDocItem[],
): FilingDocItem[] => {
  if (!dto) return existingDocs;

  const fieldMap: Record<string, string | undefined> = {
    "sales-invoices": dto.salesInvoice,
    "salesInvoice": dto.salesInvoice,
    "credit-notes": dto.creditNotes,
    "creditNotes": dto.creditNotes,
    "debit-notes": dto.debitNotes,
    "debitNotes": dto.debitNotes,
    "e-invoice": dto.eInvoiceData,
    "eInvoiceData": dto.eInvoiceData,
    "e-way-bill": dto.eWayBillData,
    "eWayBillData": dto.eWayBillData,
    "purchase-invoices": dto.purchaseInvoices,
    "purchaseInvoices": dto.purchaseInvoices,
    "gstr-2b": dto.gstr2bItcStatement,
    "gstr2bItcStatement": dto.gstr2bItcStatement,
    "expense-vouchers": dto.expenseInvoicesAndVouchers,
    "expenseInvoicesAndVouchers": dto.expenseInvoicesAndVouchers,
    "bank-statement": dto.bankStatement,
    "bankStatement": dto.bankStatement,
    "previous-returns": dto.previousGstReturns,
    "previousGstReturns": dto.previousGstReturns,
    "filing-ack": dto.previousFilingAcknowledgement,
    "previousFilingAcknowledgement": dto.previousFilingAcknowledgement,
    "other-docs": dto.otherSupportingDocuments,
    "otherSupportingDocuments": dto.otherSupportingDocuments,
  };

  return existingDocs.map((doc) => {
    // If doc already has a fileUri uploaded in local session, preserve it
    if (doc.fileUri && (doc as any).uploadedToBackend) {
      return doc;
    }
    const val = fieldMap[doc.id] || fieldMap[doc.name];
    if (val && typeof val === "string" && val.trim() !== "") {
      const fileName = val.includes("/") ? val.split("/").pop() || val : val;
      return {
        ...doc,
        fileUri: doc.fileUri || val,
        fileName: doc.fileName || fileName,
        uploadedAt: doc.uploadedAt || "Uploaded to Server",
      };
    }
    return doc;
  });
};

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
  useEffect(() => {
    const restoreTimer = setTimeout(() => {
      const routeFilingId =
        params.filingId ||
        params.id ||
        (params.appId?.startsWith("FIL") ? params.appId : undefined);
      if (routeFilingId) {
        setFilingId(routeFilingId);
      }

      if (params.appId) {
        const existingApp = useApplicationStore
          .getState()
          .applications.find((a) => a.id === params.appId);
        if (existingApp) {
          setCreatedAppId(existingApp.id);
          const fData = (existingApp.formData || {}) as Record<string, any>;
          if (fData.filingId || fData.gstfilingId || existingApp.id.startsWith("FIL")) {
            setFilingId(fData.filingId || fData.gstfilingId || existingApp.id);
          }
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
        if (gstFilingDraft.createdFilingId) {
          setFilingId((prev) => prev || gstFilingDraft.createdFilingId || null);
        }
        if (gstFilingDraft.periodData) {
          setPeriodData((prev) => ({ ...prev, ...gstFilingDraft.periodData }));
        }
        if (gstFilingDraft.documents && gstFilingDraft.documents.length > 0) {
          setDocuments(gstFilingDraft.documents as FilingDocItem[]);
        }
        if (
          typeof gstFilingDraft.stepIndex === "number" &&
          gstFilingDraft.stepIndex < 4 &&
          !params.step
        ) {
          setCurrentStep(gstFilingDraft.stepIndex);
        }
      }
    }, 0);

    return () => clearTimeout(restoreTimer);
  }, [gstFilingDraft, params.appId, params.filingId, params.id, params.step, setDocuments, setPeriodData]);

  const [isFetchingReview, setIsFetchingReview] = useState<boolean>(false);

  // Fetch persisted filing data from GstFilingController (@GetMapping("/{id}") and @GetMapping("/documents/{gstfilingId}"))
  const fetchFilingDetails = useCallback(
    async (idToFetch?: string) => {
      let targetId =
        idToFetch ||
        (filingId && filingId.trim()) ||
        (gstFilingDraft as any)?.createdFilingId ||
        (periodData as any)?.filingId ||
        (periodData as any)?.gstfilingId ||
        params.filingId ||
        (params as any).id ||
        (params.appId?.startsWith("FIL") ? params.appId : "") ||
        "";

      if (!targetId) {
        const existingApp = useApplicationStore
          .getState()
          .applications.find(
            (a) =>
              a.serviceId === "gst-filing" &&
              ((a.formData as any)?.filingId || (a.id && a.id.startsWith("FIL"))),
          );
        if (existingApp) {
          targetId =
            (existingApp.formData as any)?.filingId ||
            (existingApp.id.startsWith("FIL") ? existingApp.id : "");
        }
      }

      if (!targetId && periodData.gstin) {
        try {
          const filings = await gstApi.fetchFilings(periodData.gstin);
          if (filings && filings.length > 0) {
            const sorted = [...filings].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            );
            const latest = sorted[sorted.length - 1];
            targetId = latest.gstfilingId || latest.id || "";
          }
        } catch {}
      }

      if (!targetId) return;

      setIsFetchingReview(true);
      try {
        console.log(`🌐 [DB-FETCH] Retrieving GST filing from GET /api/v1/gst/filing/${targetId}...`);
        const dbFiling = await gstApi.getFilingById(targetId);
        if (dbFiling) {
          console.log(`🌐 [DB-FETCH] Successfully retrieved filing details:`, dbFiling);
          const mapped = mapDtoToPeriodData(dbFiling);
          setPeriodData((prev) => ({
            ...prev,
            ...mapped,
            filingId: targetId,
          }));
          setFilingId(targetId);
        }

        console.log(`🌐 [DB-FETCH] Retrieving GST filing documents from GET /api/v1/gst/filing/documents/${targetId}...`);
        const dbDocs = await gstApi.getFilingDocuments(targetId);
        if (dbDocs) {
          console.log(`🌐 [DB-FETCH] Successfully retrieved filing documents:`, dbDocs);
          setDocuments((prev) => mapDtoToFilingDocuments(dbDocs, prev));
        }
      } catch (err: any) {
        console.warn("Could not retrieve GST filing details from DB:", err?.message || err);
      } finally {
        setIsFetchingReview(false);
      }
    },
    [filingId, gstFilingDraft, periodData, params.filingId, params.id, params.appId, setPeriodData, setDocuments],
  );

  // Automatically retrieve from database when entering Review step (currentStep === 2)
  useEffect(() => {
    if (currentStep === 2) {
      fetchFilingDetails();
    }
  }, [currentStep, fetchFilingDetails]);

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

      setIsSubmitting(true);
      try {
        const custId = await getResolvedCustomerId();
        const payload = buildFilingPayload(periodData, custId);

        let targetFilingId =
          (filingId && filingId.trim()) ||
          (gstFilingDraft as any)?.createdFilingId ||
          (periodData as any)?.filingId ||
          (periodData as any)?.gstfilingId ||
          params.filingId ||
          (params as any).id ||
          (params.appId?.startsWith("FIL") ? params.appId : "") ||
          "";

        if (!targetFilingId) {
          const existingApp = useApplicationStore
            .getState()
            .applications.find(
              (a) =>
                a.serviceId === "gst-filing" &&
                ((a.formData as any)?.filingId || (a.id && a.id.startsWith("FIL"))),
            );
          if (existingApp) {
            targetFilingId =
              (existingApp.formData as any)?.filingId ||
              (existingApp.id.startsWith("FIL") ? existingApp.id : "");
          }
        }

        if (isEditMode) {
          if (targetFilingId) {
            console.log(
              `🌐 [FLOW] Updating GST filing via PUT /api/v1/gst/filing/update/${targetFilingId}...`,
            );
            await gstApi.updateFiling(targetFilingId, payload);
            setFilingId(targetFilingId);
            Alert.alert("Success", "Filing period details updated successfully.");
          } else {
            console.log(`🌐 [FLOW] Creating GST filing (no existing filing ID found)...`);
            const response = await gstApi.createFiling(payload);
            const responseStr =
              typeof response === "string" ? response : JSON.stringify(response);
            const match = responseStr.match(/Filing ID:\s*([A-Za-z0-9_-]+)/i);
            const newId = match ? match[1] : "";
            if (newId) setFilingId(newId);
          }
          setIsEditMode(false);
          setCurrentStep(2);
          return;
        }

        if (targetFilingId) {
          console.log(
            `🌐 [FLOW] Updating GST filing via PUT /api/v1/gst/filing/update/${targetFilingId}...`,
          );
          await gstApi.updateFiling(targetFilingId, payload);
          setFilingId(targetFilingId);
          setCurrentStep(1);
        } else {
          console.log(`🌐 [FLOW] Creating GST filing...`);
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
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              );
              const latest = sortedFilings[sortedFilings.length - 1];
              resolvedId = latest.gstfilingId || latest.id || "";
            }
          }

          if (resolvedId) {
            setFilingId(resolvedId);
          }
          setCurrentStep(1);
        }
      } catch (err: any) {
        Alert.alert(
          "Filing Notice",
          err?.message || "Failed to update filing details. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 1) {
      let targetFilingId =
        (filingId && filingId.trim()) ||
        (gstFilingDraft as any)?.createdFilingId ||
        (periodData as any)?.filingId ||
        (periodData as any)?.gstfilingId ||
        params.filingId ||
        (params as any).id ||
        (params.appId?.startsWith("FIL") ? params.appId : "") ||
        "";

      if (!targetFilingId) {
        const existingApp = useApplicationStore
          .getState()
          .applications.find(
            (a) =>
              a.serviceId === "gst-filing" &&
              ((a.formData as any)?.filingId || (a.id && a.id.startsWith("FIL"))),
          );
        if (existingApp) {
          targetFilingId =
            (existingApp.formData as any)?.filingId ||
            (existingApp.id.startsWith("FIL") ? existingApp.id : "");
        }
      }

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
        } catch {}
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
            console.log(
              `🌐 [FLOW] Updating GST filing documents via PUT /api/v1/gst/filing/documents/${targetFilingId}/update...`,
            );
            await gstApi.updateAllFilingDocuments(targetFilingId, docsToUpload);
            Alert.alert("Success", "Filing documents updated successfully.");
          } else {
            console.log(
              `🌐 [FLOW] Uploading GST filing documents via POST /api/v1/gst/filing/documents/${targetFilingId}/upload...`,
            );
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
          "Notice",
          uploadErr?.message || "Documents update incomplete. Proceeding to review.",
        );
        if (isEditMode) {
          setIsEditMode(false);
        }
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
          const custId = await getResolvedCustomerId();
          const payload = buildFilingPayload(periodData, custId, true);
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
