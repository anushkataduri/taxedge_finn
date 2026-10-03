import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApplicationStore } from "@/store/applicationStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { tokenManager, JwtUtils } from "@/core/authentication/tokenManager";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { gstApi } from "@/modules/gst/services/gstApi";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import {
  mapGstRegistrationPayload,
  mapDtoToGstBusinessFormData,
  mapDtoToDocuments,
} from "../utils/gstRegistrationMapper";
import { GstBusinessFormData } from "../components/GstBusinessStep/GstBusinessStep";
import {
  INITIAL_DOCUMENTS,
  DocumentItem,
} from "../components/GstUnifiedDocumentStep/GstUnifiedDocumentStep";

export const isBackendGstId = (id?: any): boolean => {
  if (!id || typeof id !== "string") return false;
  const clean = id.trim();
  if (/^GST-2026-\d+/i.test(clean)) return false;
  return /^GST\d+$/i.test(clean) || (clean.startsWith("GST") && !clean.includes("-"));
};

const extractGstId = (res: any): string => {
  if (!res) return "";
  if (typeof res === "string") {
    const match = res.match(/GST\d{6,14}/i) || res.match(/GST[A-Za-z0-9]+/i);
    return match ? match[0] : "";
  }
  const candidate =
    res.gstId ||
    res.businessId ||
    res.id ||
    res.data?.gstId ||
    res.data?.id ||
    "";
  return isBackendGstId(candidate) ? candidate : "";
};

export const useGstRegistrationFlow = (scrollViewRef: React.RefObject<any>) => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    gstId?: string;
    id?: string;
    appId?: string;
    isEdit?: string;
    edit?: string;
    step?: string;
  }>();

  // State
  const [screenIndex, setScreenIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [declared, setDeclared] = useState(true);
  const [createdAppId, setCreatedAppId] = useState<string>("");
  const [createdGstId, setCreatedGstId] = useState<string>("");
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [businessErrors, setBusinessErrors] = useState<Record<string, string>>(
    {},
  );
  const [businessData, setBusinessData] = useState<GstBusinessFormData>({
    legalName: "",
    businessName: "",
    businessType: "",
    natureOfBusiness: "",
    placeOfBusiness: "",
    businessStartDate: "",
    reasonForRegistration: "",
    compositionScheme: "",
    businessAddress: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    hsnCode: "",
    accountHolderName: "",
    bankAccountNumber: "",
    confirmBankAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountType: "",
    signatoryName: "",
    signatoryPan: "",
    signatoryDob: "",
    signatoryDesignation: "",
    signatoryMobile: "",
    signatoryEmail: "",
    addressProofType: "Rental Agreement",
    aadhaarConsent: false,
  });

  // Stores
  const gstDraft = useApplicationStore((state) => state.gstDraft);
  const saveGstDraft = useApplicationStore((state) => state.saveGstDraft);
  const clearGstDraft = useApplicationStore((state) => state.clearGstDraft);
  const createApplication = useApplicationStore(
    (state) => state.createApplication,
  );
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const authCustomer = useAuthStore((state) => state.customer);
  const authUser = useAuthStore((state) => state.authenticatedUser);

  const getResolvedCustomerId = useCallback(async (): Promise<string> => {
    if (businessData.customerId && businessData.customerId.trim()) {
      return businessData.customerId.trim();
    }
    const storeCustId =
      authCustomer?.customerId ||
      authUser?.customerId ||
      (authUser as any)?.custId ||
      (authCustomer as any)?.custId;
    if (storeCustId && String(storeCustId).trim()) {
      return String(storeCustId).trim();
    }
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
      const u = authStorage.getUser();
      const s = authStorage.getSession();
      const storageCustId = u?.customerId || (u as any)?.custId || (s as any)?.activeCustId;
      if (storageCustId && String(storageCustId).trim()) {
        return String(storageCustId).trim();
      }
    } catch {}
    return "";
  }, [authCustomer, authUser, businessData.customerId]);

  useEffect(() => {
    getResolvedCustomerId().then((cid) => {
      if (cid) {
        setBusinessData((prev) => ({
          ...prev,
          customerId: prev.customerId || cid,
          signatoryMobile:
            prev.signatoryMobile ||
            authCustomer?.mobile ||
            authUser?.mobileNumber ||
            "",
          signatoryEmail:
            prev.signatoryEmail ||
            authCustomer?.email ||
            authUser?.email ||
            "",
          signatoryName:
            prev.signatoryName ||
            authCustomer?.name ||
            authUser?.name ||
            "",
        }));
      }
    });
  }, [authCustomer, authUser, getResolvedCustomerId]);

  // Helper functions
  const hasAnyDataEntered = () => {
    const hasBusiness = Object.values(businessData).some(
      (v) =>
        (typeof v === "string" &&
          v.trim() !== "" &&
          v !== "Rental Agreement") ||
        (typeof v === "boolean" && v === true),
    );
    const hasDocs = documents.some((d) => Boolean(d.fileUri));
    return hasBusiness || hasDocs;
  };

  const syncDraft = (stepOverride?: number, gstIdOverride?: string) => {
    const targetGstId = gstIdOverride ?? createdGstId;
    saveGstDraft({
      id: "draft-gst",
      stepIndex: stepOverride ?? screenIndex,
      personalData: {},
      businessData: {
        ...businessData,
        ...(targetGstId ? { gstId: targetGstId } : {}),
      } as any,
      createdGstId: targetGstId,
      documents: documents as any,
      updatedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ...(documentId ? { documentId } : {}),
    } as any);
  };

  // Draft Guard Hook
  const draftGuard = useUniversalDraftGuard({
    isDirty: hasAnyDataEntered,
    onSaveDraft: syncDraft,
    onDiscardDraft: clearGstDraft,
    isSubmitted: () => screenIndex >= 3,
  });

  // Auto-restore draft & handle route params
  useEffect(() => {
    const rawRouteGstId = params.gstId || params.id || params.appId;
    const routeGstId = isBackendGstId(rawRouteGstId) ? rawRouteGstId : undefined;

    if (routeGstId) {
      setCreatedGstId(routeGstId);
      setBusinessData((prev) => ({ ...prev, gstId: routeGstId }));
      gstApi
        .getBusiness(routeGstId)
        .then((existingDto) => {
          if (existingDto) {
            setBusinessData((prev) => ({
              ...prev,
              ...mapDtoToGstBusinessFormData(existingDto),
              gstId: routeGstId,
            }));
          }
        })
        .catch((e) => {
          console.warn("Could not fetch initial business details:", e);
        });
    }

    if (params.edit === "true" || params.isEdit === "true") {
      setIsEditMode(true);
    }
    if (params.step) {
      const parsedStep = parseInt(params.step, 10);
      if (!isNaN(parsedStep) && parsedStep >= 0 && parsedStep <= 3) {
        setScreenIndex(parsedStep);
      }
    }

    if (!gstDraft) return;

    if (gstDraft.businessData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBusinessData((prev) => ({
        ...prev,
        ...gstDraft.businessData,
        businessName:
          gstDraft.businessData.businessName ||
          (gstDraft.businessData as any).registeredBusinessName ||
          "",
        businessType: gstDraft.businessData.businessType || "",
      }));
    }
    if (gstDraft.documents && Array.isArray(gstDraft.documents)) {
      setDocuments(gstDraft.documents as DocumentItem[]);
    }
    if (typeof gstDraft.stepIndex === "number" && gstDraft.stepIndex < 3 && !params.step) {
      setScreenIndex(gstDraft.stepIndex);
    }
    if (isBackendGstId(gstDraft.createdGstId)) {
      setCreatedGstId((prev) => (isBackendGstId(prev) ? prev : gstDraft.createdGstId!));
    } else if (isBackendGstId((gstDraft.businessData as any)?.gstId)) {
      setCreatedGstId((prev) => (isBackendGstId(prev) ? prev : (gstDraft.businessData as any).gstId));
    }
    if ((gstDraft as any).documentId) {
      setDocumentId((gstDraft as any).documentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.gstId, params.id, params.appId, params.edit, params.isEdit, params.step]);

  const [isFetchingReview, setIsFetchingReview] = useState<boolean>(false);

  // Fetch persisted data from GstRegistrationController (@GetMapping("/business/{gstId}") and @GetMapping("/documents/{documentId}"))
  const fetchRegistrationDetails = useCallback(
    async (gstIdToFetch?: string, docIdToFetch?: string) => {
      const activeGstId =
        gstIdToFetch ||
        createdGstId ||
        businessData.gstId ||
        params.gstId ||
        params.id ||
        (params.appId?.startsWith("GST") ? params.appId : undefined);

      if (!businessData.legalName) {
        setIsFetchingReview(true);
      }

      try {
        if (activeGstId) {
          console.log(`🌐 [DB-FETCH] Retrieving business details for: ${activeGstId}`);
          const dbBusiness = await gstApi.getBusiness(activeGstId);
          if (dbBusiness) {
            console.log(`🌐 [DB-FETCH] Successfully retrieved business details:`, dbBusiness);
            const mapped = mapDtoToGstBusinessFormData(dbBusiness);
            setBusinessData((prev) => ({
              ...prev,
              ...mapped,
              gstId: activeGstId,
            }));
          }
        }

        const activeDocId =
          docIdToFetch ||
          documentId ||
          (gstDraft as any)?.documentId;

        if (activeDocId) {
          console.log(`🌐 [DB-FETCH] Retrieving documents for: ${activeDocId}`);
          const dbDocs = await gstApi.getRegistrationDocuments(activeDocId);
          if (dbDocs) {
            console.log(`🌐 [DB-FETCH] Successfully retrieved documents:`, dbDocs);
            setDocuments((prev) => mapDtoToDocuments(dbDocs, prev));
          }
        }
      } catch (err: any) {
        console.warn("Could not retrieve documents from DB:", err?.message || err);
      } finally {
        setIsFetchingReview(false);
      }
    },
    [createdGstId, businessData.gstId, businessData.legalName, params.gstId, params.id, params.appId, documentId, gstDraft],
  );

  // Automatically retrieve from database when entering Review step (screenIndex === 2)
  useEffect(() => {
    if (screenIndex === 2) {
      fetchRegistrationDetails();
    }
  }, [screenIndex, fetchRegistrationDetails]);

  // Form Interactions
  const handleBusinessChange = (fields: Partial<GstBusinessFormData>) => {
    setBusinessData((prev) => {
      const updated = { ...prev, ...fields };
      setBusinessErrors((prevErrors) => {
        return Object.keys(fields).reduce<Record<string, string>>(
          (acc, k) => {
            const key = k as keyof GstBusinessFormData;
            if (acc[key]) {
              const val = updated[key];
              acc[key] = GstValidators.validateBusinessField(
                key,
                typeof val === "boolean" ? String(val) : val || "",
              );
            }
            return acc;
          },
          { ...prevErrors },
        );
      });
      return updated;
    });
  };

  const handleBusinessBlur = (field: keyof GstBusinessFormData) => {
    const val = businessData[field];
    const errorMsg = GstValidators.validateBusinessField(
      field,
      typeof val === "boolean" ? String(val) : val || "",
    );
    setBusinessErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleUpdateDocuments = (updated: DocumentItem[]) => {
    setDocuments(updated);
    saveGstDraft({
      id: "draft-gst",
      stepIndex: 1,
      personalData: {},
      businessData: businessData as any,
      createdGstId,
      documents: updated as any,
      updatedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  // Validations
  const validateBusinessDetails = (): boolean => {
    const errs = GstValidators.validateBusinessForm(
      businessData as unknown as Record<string, string>,
    );
    setBusinessErrors(errs);
    if (Object.keys(errs).length > 0) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      Alert.alert(
        "Required Fields Missing",
        "Please enter all the required fields correctly to proceed.",
      );
      return false;
    }
    return true;
  };

  const validateDocuments = (): boolean => {
    const mandatoryMissing = documents.filter((d) => d.required && !d.fileUri);
    if (mandatoryMissing.length > 0) {
      const missingNames = mandatoryMissing.map((d) => d.name).join(", ");
      Alert.alert(
        "Required Documents Missing",
        `Please upload:\n\n\u2022 ${missingNames.split(", ").join("\n\u2022 ")}`,
      );
      return false;
    }
    return true;
  };

  // Flow Navigation
  const handleEditStep = (targetStepIndex: number, section?: string) => {
    setIsEditMode(true);
    setEditSection(section || null);
    setScreenIndex(targetStepIndex);
    setTimeout(() => {
      if (targetStepIndex === 0) {
        if (section === "bank") {
          scrollViewRef.current?.scrollTo({ y: 550, animated: true });
        } else if (section === "signatory") {
          scrollViewRef.current?.scrollTo({ y: 1100, animated: true });
        } else {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
      } else {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    }, 100);
  };

  const handleBack = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setEditSection(null);
      setScreenIndex(2);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    if (screenIndex === 4) {
      router.replace("/(main)/home");
      return;
    }
    if (screenIndex > 0) {
      setScreenIndex((prev) => prev - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    if (hasAnyDataEntered()) {
      draftGuard.openDraftModal();
    } else {
      router.back();
    }
  };

  // -------------------------------------------------------------
  // Step-Specific Handlers (Strategy Pattern to avoid if-else)
  // -------------------------------------------------------------

  const submitBusinessStep = async () => {
    if (!validateBusinessDetails()) return;

    const custId = await getResolvedCustomerId();

    // Resolve gstId across state, form data, route params, draft, and store (ignoring frontend mock IDs)
    let targetGstId =
      (isBackendGstId(createdGstId) ? createdGstId : "") ||
      (isBackendGstId(businessData.gstId) ? businessData.gstId : "") ||
      (isBackendGstId(params.gstId) ? params.gstId : "") ||
      (isBackendGstId(params.id) ? params.id : "") ||
      (isBackendGstId(params.appId) ? params.appId : "") ||
      (isBackendGstId((gstDraft as any)?.createdGstId) ? (gstDraft as any).createdGstId : "") ||
      (isBackendGstId((gstDraft as any)?.gstId) ? (gstDraft as any).gstId : "") ||
      (isBackendGstId((gstDraft?.businessData as any)?.gstId) ? (gstDraft?.businessData as any).gstId : "") ||
      "";

    if (!targetGstId) {
      const existingApp = useApplicationStore
        .getState()
        .applications.find(
          (a) =>
            (a.serviceId === "gst-registration" || a.category === "GST") &&
            (isBackendGstId(a.formData?.gstId) ||
              isBackendGstId((a.formData as any)?.createdGstId) ||
              isBackendGstId(a.id)),
        );
      if (existingApp) {
        targetGstId =
          (isBackendGstId(existingApp.formData?.gstId) ? existingApp.formData!.gstId! : "") ||
          (isBackendGstId((existingApp.formData as any)?.createdGstId) ? (existingApp.formData as any).createdGstId : "") ||
          (isBackendGstId(existingApp.id) ? existingApp.id : "");
      }
    }

    const payload = mapGstRegistrationPayload(businessData, custId, targetGstId);

    if (isEditMode) {
      if (targetGstId) {
        console.log(
          `🌐 [FLOW] Updating GST business details via PUT /api/v1/gst/business/update/${targetGstId}...`,
        );
        await gstApi.updateRegistration(targetGstId, payload);
        setCreatedGstId(targetGstId);
        setBusinessData((prev) => ({ ...prev, gstId: targetGstId }));
        syncDraft(2, targetGstId);
      } else {
        console.log(
          `🌐 [FLOW] Registering GST business details (no existing gstId found)...`,
        );
        const response = await gstApi.submitRegistration(payload);
        const newGstId = extractGstId(response);
        if (newGstId) {
          setCreatedGstId(newGstId);
          setBusinessData((prev) => ({ ...prev, gstId: newGstId }));
          syncDraft(2, newGstId);
        }
      }
      setIsEditMode(false);
      setEditSection(null);
      setScreenIndex(2);
      Alert.alert("Success", "Business details updated successfully.");
      return;
    }

    if (targetGstId) {
      console.log(
        `🌐 [FLOW] Updating GST business details via PUT /api/v1/gst/business/update/${targetGstId}...`,
      );
      await gstApi.updateRegistration(targetGstId, payload);
      setCreatedGstId(targetGstId);
      setBusinessData((prev) => ({ ...prev, gstId: targetGstId }));
      syncDraft(1, targetGstId);
    } else {
      console.log(`🌐 [FLOW] Registering GST business details...`);
      const response = await gstApi.submitRegistration(payload);
      const newGstId = extractGstId(response);
      if (newGstId) {
        setCreatedGstId(newGstId);
        setBusinessData((prev) => ({ ...prev, gstId: newGstId }));
        syncDraft(1, newGstId);
      } else {
        syncDraft(1);
      }
    }
    setScreenIndex(1);
  };

  const submitDocumentsStep = async () => {
    if (!validateDocuments()) return;

    if (isEditMode) {
      syncDraft(2);
      if (documentId) {
        await gstApi.updateAllDocuments(
          documentId,
          documents,
          businessData.addressProofType,
        );
      } else if (createdGstId) {
        const res = await gstApi.uploadAllDocuments(
          createdGstId,
          documents,
          businessData.addressProofType,
        );
        const match = String(res).match(/Document ID:\s*([A-Za-z0-9_-]+)/i);
        if (match) setDocumentId(match[1]);
      }
      setIsEditMode(false);
      setEditSection(null);
      setScreenIndex(2);
      return;
    }

    syncDraft(2);

    if (createdGstId) {
      const res = await gstApi.uploadAllDocuments(
        createdGstId,
        documents,
        businessData.addressProofType,
      );
      const match = String(res).match(/Document ID:\s*([A-Za-z0-9_-]+)/i);
      if (match) setDocumentId(match[1]);
    }
    setScreenIndex(2);
  };

  const submitReviewStep = async () => {
    if (!declared) {
      Alert.alert(
        "Declaration Required",
        "Please accept the declaration to proceed to payment.",
      );
      return;
    }
    syncDraft(3);

    if (createdGstId) {
      try {
        const custId = await getResolvedCustomerId();
        await gstApi.updateRegistration(
          createdGstId,
          mapGstRegistrationPayload(businessData, custId, createdGstId),
        );
      } catch (e) {
        console.warn("Failed to update final registration details", e);
      }
    }
    setScreenIndex(3);
  };

  // -------------------------------------------------------------
  // Main Execution
  // -------------------------------------------------------------

  const handleContinue = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const stepHandlers: Record<number, () => Promise<void>> = {
        0: submitBusinessStep,
        1: submitDocumentsStep,
        2: submitReviewStep,
      };

      const executeStep = stepHandlers[screenIndex];
      if (executeStep) {
        await executeStep();
      }

      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "An unexpected error occurred. Please try again.",
      );
      console.error("GST Flow Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (txnId: string, paymentMethod: string) => {
    try {
      const targetGstId =
        (isBackendGstId(createdGstId) ? createdGstId : "") ||
        (isBackendGstId(businessData.gstId) ? businessData.gstId : "") ||
        (isBackendGstId((gstDraft as any)?.createdGstId) ? (gstDraft as any).createdGstId : "") ||
        (isBackendGstId((gstDraft as any)?.businessData?.gstId) ? (gstDraft as any).businessData.gstId : "") ||
        (isBackendGstId(params.gstId) ? params.gstId : "") ||
        (isBackendGstId(params.id) ? params.id : "") ||
        createdGstId ||
        businessData.gstId ||
        "";

      const appId = createApplication(
        "gst-registration",
        "GST Registration",
        "GST",
        {
          ...businessData,
          gstId: targetGstId,
          applicantName:
            businessData.businessName ||
            businessData.legalName ||
            "Your Business",
          appliedDate: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          transactionId: txnId,
          paymentMethod,
          paymentAmount: 1499,
          paymentStatus: "Paid",
        } as any,
        documents.map((d) => ({
          name: d.name,
          status: "Uploaded" as const,
          fileUri: d.fileUri,
          fileName: d.fileName,
          fileSize: d.fileSize,
        })),
        1499,
        "Paid",
        false,
        targetGstId || undefined,
      );

      const finalDisplayId = targetGstId || appId;
      setCreatedAppId(finalDisplayId);
      if (targetGstId) {
        setCreatedGstId(targetGstId);
      }
      draftGuard.markSubmitted();
      clearGstDraft();
      addNotification(
        "GST Application Submitted",
        `Your GST Registration (ID: ${finalDisplayId}) has been successfully submitted and is under verification.`,
        "gst",
      );
      setScreenIndex(4);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } catch {
      Alert.alert(
        "Submission Failed",
        "Could not complete the process. Please try again.",
      );
    }
  };

  const resolvedBackendGstId =
    (isBackendGstId(createdGstId) ? createdGstId : "") ||
    (isBackendGstId(businessData.gstId) ? businessData.gstId : "") ||
    (isBackendGstId(createdAppId) ? createdAppId : "") ||
    createdGstId ||
    businessData.gstId;

  return {
    screenIndex,
    setScreenIndex,
    isLoading,
    declared,
    setDeclared,
    businessData,
    businessErrors,
    documents,
    createdAppId: resolvedBackendGstId || createdAppId,
    createdGstId: resolvedBackendGstId,
    draftGuard,
    handleBusinessChange,
    handleBusinessBlur,
    handleUpdateDocuments,
    handleContinue,
    handlePaymentSuccess,
    handleBack,
    isEditMode,
    editSection,
    handleEditStep,
    fetchRegistrationDetails,
    isFetchingReview,
  };
};
