/**
 * Screen: GST Registration
 * Migrated to modular architecture.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { GstStepIndicator } from "@/modules/gst/gst-registration/components/GstStepIndicator/GstStepIndicator";
import {
  GstBusinessStep,
  GstBusinessFormData,
} from "@/modules/gst/gst-registration/components/GstBusinessStep/GstBusinessStep";
import {
  GstUnifiedDocumentStep,
  INITIAL_DOCUMENTS,
  DocumentItem,
} from "@/modules/gst/gst-registration/components/GstUnifiedDocumentStep/GstUnifiedDocumentStep";
import { GstReviewStep } from "@/modules/gst/gst-registration/components/GstReviewStep/GstReviewStep";
import { GstRegistrationPaymentStep } from "@/modules/gst/gst-registration/components/GstRegistrationPaymentStep";
import { GstApplicationStatusStep } from "@/modules/gst/gst-status/components/GstApplicationStatusStep/GstApplicationStatusStep";
import { useApplicationStore } from "@/store/applicationStore";
import { useNotificationStore } from "@/store/notificationStore";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { styles } from "./GstRegistrationScreen.styles";

const STEPS = ["Business", "Documents", "Review", "Payment"];

export const GstRegistrationScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [screenIndex, setScreenIndex] = useState(0);
  const [declared, setDeclared] = useState(true);
  const [createdAppId, setCreatedAppId] = useState<string>("GST-2026-84920");

  // Stores
  const gstDraft = useApplicationStore((state) => state.gstDraft);
  const saveGstDraft = useApplicationStore((state) => state.saveGstDraft);
  const clearGstDraft = useApplicationStore((state) => state.clearGstDraft);
  const createApplication = useApplicationStore((state) => state.createApplication);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Form State
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
  const [businessErrors, setBusinessErrors] = useState<Record<string, string>>({});

  // Unified Documents State
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);

  // Universal Draft Guard Hook
  const {
    showDraftModal,
    openDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () => {
      const hasBusiness = Object.values(businessData).some((v) => 
        (typeof v === 'string' && v.trim() !== "" && v !== "Rental Agreement") || 
        (typeof v === 'boolean' && v === true)
      );
      const hasDocs = documents.some((d) => Boolean(d.fileUri));
      return hasBusiness || hasDocs;
    },
    onSaveDraft: () => {
      saveGstDraft({
        id: "draft-gst",
        stepIndex: screenIndex,
        personalData: {},
        businessData: businessData as any,
        documents: documents as any,
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    },
    onDiscardDraft: () => {
      clearGstDraft();
    },
    isSubmitted: () => screenIndex >= 3,
  });

  // Scroll to top on step transition
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [screenIndex]);

  // Auto-restore draft on mount if available
  useEffect(() => {
    if (gstDraft) {
      if (gstDraft.businessData) {
        setBusinessData((prev) => ({
          ...prev,
          ...gstDraft.businessData,
          businessName: gstDraft.businessData.businessName || (gstDraft.businessData as any).registeredBusinessName || (gstDraft.personalData as any)?.businessName || "",
          businessType: gstDraft.businessData.businessType || (gstDraft.personalData as any)?.businessType || "",
        }));
      }
      if (gstDraft.documents && Array.isArray(gstDraft.documents)) {
        setDocuments(gstDraft.documents as DocumentItem[]);
      }
      if (typeof gstDraft.stepIndex === "number" && gstDraft.stepIndex < 3) {
        setScreenIndex(gstDraft.stepIndex);
      }
    }
  }, []);

  const getScreenTitle = () => {
    switch (screenIndex) {
      case 0: return "GST Registration";
      case 1: return "Upload Documents";
      case 2: return "Review Application";
      case 3: return "Service Payment";
      default: return "Application Status";
    }
  };

  const getButtonText = () => {
    switch (screenIndex) {
      case 0: return "Continue to Documents";
      case 1: return "Continue to Review";
      case 2: return "Proceed to Payment (₹1,499)";
      default: return "";
    }
  };

  // Functional real-time change & blur handlers for Business
  const handleBusinessChange = (fields: Partial<GstBusinessFormData>) => {
    setBusinessData((prev) => {
      const updated = { ...prev, ...fields };
      setBusinessErrors((prevErrors) => {
        return Object.keys(fields).reduce<Record<string, string>>((acc, k) => {
          const key = k as keyof GstBusinessFormData;
          if (acc[key]) {
            const val = updated[key];
            const strVal = typeof val === "boolean" ? String(val) : (val || "");
            const revalidated = GstValidators.validateBusinessField(key, strVal);
            return { ...acc, [key]: revalidated };
          }
          return acc;
        }, { ...prevErrors });
      });
      return updated;
    });
  };

  const handleBusinessBlur = (field: keyof GstBusinessFormData) => {
    const val = businessData[field];
    const strVal = typeof val === "boolean" ? String(val) : (val || "");
    const errorMsg = GstValidators.validateBusinessField(field, strVal);
    setBusinessErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const validateBusinessDetails = (): boolean => {
    const errs = GstValidators.validateBusinessForm(businessData as unknown as Record<string, string>);
    setBusinessErrors(errs);
    if (Object.keys(errs).length > 0) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      Alert.alert("Required Fields Missing", "Please enter all the required fields correctly to proceed.");
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
        `Please upload the following required documents before proceeding:\n\nâ€¢ ${missingNames.split(", ").join("\nâ€¢ ")}`
      );
      return false;
    }
    return true;
  };

  const hasAnyDataEntered = () => {
    const hasBusiness = Object.values(businessData).some((v) => 
      (typeof v === 'string' && v.trim() !== "" && v !== "Rental Agreement") || 
      (typeof v === 'boolean' && v === true)
    );
    const hasDocs = documents.some((d) => Boolean(d.fileUri));
    return hasBusiness || hasDocs;
  };

  const handleBack = () => {
    if (screenIndex === 4) {
      router.replace("/(main)/home");
      return;
    }

    if (screenIndex > 0) {
      setScreenIndex((prev) => prev - 1);
      return;
    }

    // On Step 0 (or exit) - open custom draft modal (matching Image 4) if any data entered
    if (hasAnyDataEntered()) {
      openDraftModal();
    } else {
      router.back();
    }
  };

  const handleContinue = () => {
    if (screenIndex === 0) {
      if (!validateBusinessDetails()) return;
      saveGstDraft({
        id: "draft-gst",
        stepIndex: 1,
        personalData: {},
        businessData: businessData as any,
        documents: documents as any,
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setScreenIndex(1);
    } else if (screenIndex === 1) {
      if (!validateDocuments()) return;
      saveGstDraft({
        id: "draft-gst",
        stepIndex: 2,
        personalData: {},
        businessData: businessData as any,
        documents: documents as any,
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setScreenIndex(2);
    } else if (screenIndex === 2) {
      if (!declared) {
        Alert.alert("Declaration Required", "Please accept the declaration to proceed to payment.");
        return;
      }

      saveGstDraft({
        id: "draft-gst",
        stepIndex: 3,
        personalData: {},
        businessData: businessData as any,
        documents: documents as any,
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setScreenIndex(3);
    }
  };

  const handlePaymentSuccess = (txnId: string, paymentMethod: string) => {
    const appId = createApplication(
      "gst-registration",
      "GST Registration",
      "GST",
      {
        ...businessData,
        applicantName: businessData.businessName || businessData.legalName || "Your Business",
        appliedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        transactionId: txnId,
        paymentMethod: paymentMethod,
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
      "Paid"
    );

    setCreatedAppId(appId);
    markSubmitted();
    clearGstDraft();

    addNotification(
      "GST Application Submitted",
      `Your GST Registration (ID: ${appId}) has been successfully submitted and is under verification.`,
      "gst"
    );

    setScreenIndex(4);
  };

  return (
    <View style={styles.root}>
      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color={BrandColors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
        <View style={styles.placeholderBox} />
      </View>

      {/* 4-Step Indicator */}
      {screenIndex < 4 && (
        <GstStepIndicator
          steps={STEPS}
          currentStep={screenIndex}
        />
      )}

      {/* Main Scroll Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          screenIndex === 4 && { paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        overScrollMode="always"
        nestedScrollEnabled={true}
      >
        {screenIndex === 0 && (
          <GstBusinessStep
            data={businessData}
            errors={businessErrors}
            onChange={handleBusinessChange}
            onBlurField={handleBusinessBlur}
          />
        )}

        {screenIndex === 1 && (
          <GstUnifiedDocumentStep
            documents={documents}
            onUpdateDocuments={(updated) => {
              setDocuments(updated);
              saveGstDraft({
                id: "draft-gst",
                stepIndex: 1,
                personalData: {},
                businessData: businessData as any,
                documents: updated as any,
                updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              });
            }}
          />
        )}

        {screenIndex === 2 && (
          <GstReviewStep
            businessData={businessData}
            documents={documents}
            onEditStep={(stepIdx) => setScreenIndex(stepIdx)}
            declared={declared}
            onToggleDeclaration={() => setDeclared((prev) => !prev)}
          />
        )}

        {screenIndex === 3 && (
          <GstRegistrationPaymentStep
            businessName={businessData.businessName || businessData.legalName || "Your Business"}
            onPaymentSuccess={handlePaymentSuccess}
            onBackToReview={() => setScreenIndex(2)}
          />
        )}

        {screenIndex === 4 && (
          <GstApplicationStatusStep
            appId={createdAppId}
            businessName={businessData.businessName || "Your Business"}
            appliedDate="Today"
            serviceName="GST Registration"
          />
        )}

        {/* Action Button - In scroll view so it stays cleanly at the bottom */}
        {screenIndex < 3 && (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleContinue}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>{getButtonText()}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Universal Save As Draft Confirmation Modal */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Application Progress?"
        message="You have unsaved changes in your GST registration application. Save your progress so you can resume anytime without re-entering details."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default GstRegistrationScreen;
