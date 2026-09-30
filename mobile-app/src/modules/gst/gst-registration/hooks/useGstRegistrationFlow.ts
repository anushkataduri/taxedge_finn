import { useState, useEffect, useRef } from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useApplicationStore } from "@/store/applicationStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { gstApi } from "@/modules/gst/services/gstApi";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import {
  mapGstRegistrationPayload,
  mapDocumentType,
} from "../utils/gstRegistrationMapper";
import { GstBusinessFormData } from "../components/GstBusinessStep/GstBusinessStep";
import {
  INITIAL_DOCUMENTS,
  DocumentItem,
} from "../components/GstUnifiedDocumentStep/GstUnifiedDocumentStep";

export const useGstRegistrationFlow = (scrollViewRef: React.RefObject<any>) => {
  const router = useRouter();

  // State
  const [screenIndex, setScreenIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [declared, setDeclared] = useState(true);
  const [createdAppId, setCreatedAppId] = useState<string>("GST-2026-84920");
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

  const syncDraft = (stepOverride?: number) => {
    saveGstDraft({
      id: "draft-gst",
      stepIndex: stepOverride ?? screenIndex,
      personalData: {},
      businessData: businessData as any,
      createdGstId,
      documents: documents as any,
      updatedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  // Draft Guard Hook
  const draftGuard = useUniversalDraftGuard({
    isDirty: hasAnyDataEntered,
    onSaveDraft: syncDraft,
    onDiscardDraft: clearGstDraft,
    isSubmitted: () => screenIndex >= 3,
  });

  // Auto-restore draft
  useEffect(() => {
    if (!gstDraft) return;

    if (gstDraft.businessData) {
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
    if (typeof gstDraft.stepIndex === "number" && gstDraft.stepIndex < 3) {
      setScreenIndex(gstDraft.stepIndex);
    }
    if (gstDraft.createdGstId) {
      setCreatedGstId(gstDraft.createdGstId);
    }
  }, []);

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
  const handleBack = () => {
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
    syncDraft(1);

    const payload = mapGstRegistrationPayload(businessData);
    if (createdGstId) {
      await gstApi.updateRegistration(createdGstId, payload);
    } else {
      const response = await gstApi.submitRegistration(payload);
      const responseStr =
        typeof response === "string" ? response : JSON.stringify(response);
      const match = responseStr.match(/(GST\d+)/);
      setCreatedGstId(
        match
          ? match[1]
          : typeof response === "string"
            ? response
            : response?.gstId || response?.businessId || "",
      );
    }
    setScreenIndex(1);
  };

  const submitDocumentsStep = async () => {
    if (!validateDocuments()) return;
    syncDraft(2);

    if (createdGstId) {
      const uploadPromises = documents
        .filter((d) => d.fileUri)
        .map(async (doc) => {
          const { type, subType } = mapDocumentType(doc.id, doc.subtitle);
          return gstApi.uploadDocument(
            createdGstId,
            type,
            subType,
            doc.fileUri!,
            doc.fileName || "doc.jpg",
          );
        });
      await Promise.all(uploadPromises);
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
        await gstApi.updateRegistration(
          createdGstId,
          mapGstRegistrationPayload(businessData),
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
      const appId = createApplication(
        "gst-registration",
        "GST Registration",
        "GST",
        {
          ...businessData,
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
      );

      setCreatedAppId(appId);
      draftGuard.markSubmitted();
      clearGstDraft();
      addNotification(
        "GST Application Submitted",
        `Your GST Registration (ID: ${appId}) has been successfully submitted and is under verification.`,
        "gst",
      );
      setScreenIndex(4);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } catch (error) {
      Alert.alert(
        "Submission Failed",
        "Could not complete the process. Please try again.",
      );
    }
  };

  return {
    screenIndex,
    setScreenIndex,
    isLoading,
    declared,
    setDeclared,
    businessData,
    businessErrors,
    documents,
    createdAppId,
    createdGstId,
    draftGuard,
    handleBusinessChange,
    handleBusinessBlur,
    handleUpdateDocuments,
    handleContinue,
    handlePaymentSuccess,
    handleBack,
  };
};
