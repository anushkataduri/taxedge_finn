import React, { useState, useEffect, useRef } from "react";
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
import {
  GstFilingPeriodStep,
  GstFilingPeriodData,
} from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstFilingPeriodStep";

import {
  GstFilingDocumentsStep,
  INITIAL_FILING_DOCS,
  FilingDocItem,
} from "@/modules/gst/gst-filing/components/GstFilingDocumentsStep/GstFilingDocumentsStep";

import { GstFilingReviewStep } from "@/modules/gst/gst-filing/components/GstFilingReviewStep/GstFilingReviewStep";
import { GstPaymentMethodStep } from "@/modules/gst/gst-filing/components/payment/GstPaymentMethodStep/GstPaymentMethodStep";
import { GstPaymentSuccessStep } from "@/modules/gst/gst-filing/components/payment/GstPaymentSuccessStep/GstPaymentSuccessStep";
import { GstPaymentReceiptStep } from "@/modules/gst/gst-filing/components/payment/GstPaymentReceiptStep/GstPaymentReceiptStep";
import { GstApplicationStatusStep } from "@/modules/gst/gst-status/components/GstApplicationStatusStep/GstApplicationStatusStep";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { styles } from "./GstFilingScreen.styles";
import { useApplicationStore } from "@/store/applicationStore";
import { useNotificationStore } from "@/store/notificationStore";
export const GstFilingScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [currentStep, setCurrentStep] = useState(0);

  // Form State: Starts clean without arbitrary dummy pre-fills
  const [periodData, setPeriodData] = useState<GstFilingPeriodData>({
    periodType: "",
    financialYear: "FY 2025-26",
    filingPeriod: "",
    filingMonth: "",
    gstin: "",
    filingType: "",
    filingNature: "Regular Return",
    calculationMethod: "ca_assisted",
  });
  const [periodErrors, setPeriodErrors] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<FilingDocItem[]>(INITIAL_FILING_DOCS);

  // Payment State
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");

  // Result metadata
  const [createdAppId, setCreatedAppId] = useState("");
  const [txnId, setTxnId] = useState("");

  // Access stores
  const gstFilingDraft = useApplicationStore((state) => state.gstFilingDraft);
  const saveGstFilingDraft = useApplicationStore((state) => state.saveGstFilingDraft);
  const clearGstFilingDraft = useApplicationStore((state) => state.clearGstFilingDraft);
  const createApplication = useApplicationStore((state) => state.createApplication);

  // Universal Draft Guard Hook for Back Gesture and Hardware Back Interception
  const {
    showDraftModal,
    markSubmitted,
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
        documents.some((d) => Boolean(d.fileUri))
      ),
    onSaveDraft: () => {
      saveGstFilingDraft({
        id: "gst-filing-draft",
        stepIndex: currentStep,
        periodData,
        documents,
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    },
    onDiscardDraft: () => {
      clearGstFilingDraft();
    },
    isSubmitted: () => currentStep >= 4,
  });

  // Restore draft if available on initial mount
  useEffect(() => {
    if (gstFilingDraft) {
      if (gstFilingDraft.periodData) {
        setPeriodData((prev) => ({ ...prev, ...gstFilingDraft.periodData }));
      }
      if (gstFilingDraft.documents && gstFilingDraft.documents.length > 0) {
        setDocuments(gstFilingDraft.documents as FilingDocItem[]);
      }
      if (typeof gstFilingDraft.stepIndex === "number" && gstFilingDraft.stepIndex < 4) {
        setCurrentStep(gstFilingDraft.stepIndex);
      }
    }
  }, []);

  // Universal Scroll-to-Top resetting whenever user transitions to another step
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentStep]);

  const getScreenTitle = () => {
    switch (currentStep) {
      case 0: return "GST Filing Period";
      case 1: return "Filing Documents";
      case 2: return "Filing Review & Computation";
      case 3: return "Complete Payment";
      case 4: return "Payment Successful";
      case 5: return "Payment Receipt";
      default: return "Application Status";
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 0: return "Continue to Documents";
      case 1: return "Continue to Review";
      case 2: return "Approve & Proceed to Payment";
      case 3: return "Pay Securely ₹2,344";
      default: return "";
    }
  };

  const validatePeriodStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (!GstValidators.isNotEmpty(periodData.periodType)) {
      errs.periodType = "Please select a filing frequency";
    }
    if (!periodData.financialYear || !GstValidators.isNotEmpty(periodData.financialYear)) {
      errs.financialYear = "Please select a financial year";
    }
    const periodVal = periodData.filingPeriod || periodData.filingMonth;
    if (!periodVal || !GstValidators.isNotEmpty(periodVal)) {
      errs.filingPeriod = "Please select a filing return period";
      errs.filingMonth = "Please select a filing return period";
    }
    if (!GstValidators.isValidGstin(periodData.gstin)) {
      errs.gstin = "Enter a valid 15-character GSTIN (e.g. 29AAAAA0000A1Z5)";
    }
    if (!GstValidators.isNotEmpty(periodData.filingType)) {
      errs.filingType = "Please select a return type";
    }

    setPeriodErrors(errs);
    if (Object.keys(errs).length > 0) {
      Alert.alert("Required Fields Missing", "Please select filing frequency, financial year, return period, valid GSTIN, and return type.");
      return false;
    }
    return true;
  };

  const validatePaymentStep = (): boolean => {
    if (selectedMethod === "upi") {
      if (!GstValidators.isValidUpi(upiId)) {
        setUpiError("Enter a valid UPI ID (e.g. yourname@bank / mobile@upi)");
        Alert.alert("Invalid UPI ID", "Please enter a valid UPI ID to complete payment.");
        return false;
      }
    }
    setUpiError("");
    return true;
  };

  const handleBack = () => {
    if (currentStep === 5 || currentStep === 6) {
      setCurrentStep(4);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleContinue = () => {
    if (currentStep === 0) {
      if (!validatePeriodStep()) return;
    } else if (currentStep === 1) {
      const requiredMissing = documents.filter((d) => d.required && !d.fileUri);
      if (requiredMissing.length > 0) {
        Alert.alert(
          "Documents Required",
          `Please upload mandatory filing documents (${requiredMissing.map((d) => d.name).join(", ")}) before proceeding to review.`
        );
        return;
      }
    } else if (currentStep === 3) {
      if (!validatePaymentStep()) return;

      // Execute submission and store sync
      const newTxn = "TXN" + Date.now().toString().slice(-8);
      setTxnId(newTxn);

      const requiredDocNames = documents
        .filter((d) => d.fileUri)
        .map((d) => d.name);

      const periodLabel = periodData.filingPeriod || periodData.filingMonth;
      const businessDisplayName = periodData.tradeName || periodData.businessName || "Shree Deshmukh Traders";
      const legalDisplayName = periodData.legalName || businessDisplayName;

      const appDocuments = documents.map((d) => ({
        name: d.name,
        status: (d.fileUri ? "Uploaded" : "Pending") as "Uploaded" | "Pending",
        fileUri: d.fileUri,
      }));

      const appId = createApplication(
        "gst-filing",
        `GST Return Filing (${periodData.filingType ? periodData.filingType.split(" ")[0] : "GSTR-3B"} - ${periodLabel})`,
        "GST",
        {
          applicantName: businessDisplayName,
          businessName: businessDisplayName,
          legalName: legalDisplayName,
          state: periodData.state || "Karnataka",
          gstin: periodData.gstin,
          taxpayerScheme: periodData.taxpayerScheme || "Regular Scheme",
          filingNature: periodData.filingNature || "Regular Return",
          calculationMethod: periodData.calculationMethod || "ca_assisted",
          financialYear: periodData.financialYear || "FY 2025-26",
          filingPeriod: periodLabel,
          filingMonth: periodLabel,
          filingType: periodData.filingType,
          filingFrequency: periodData.periodType,
          turnover: periodData.taxableSales || periodData.turnover || "",
          eligibleItc: periodData.eligibleItc || "",
          paymentMethod: selectedMethod.toUpperCase(),
          transactionId: newTxn,
        },
        appDocuments,
        2344,
        "Paid"
      );

      setCreatedAppId(appId);
      markSubmitted();
      clearGstFilingDraft();

      // Dispatch real-time notification
      useNotificationStore.getState().addNotification(
        "Payment & Filing Received",
        `Your GST filing request for ${periodLabel} (${periodData.financialYear || "FY 2025-26"}) (App ID: ${appId}) has been confirmed. CA is preparing reconciliation.`,
        "gst"
      );
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const uploadedDocsCount = documents.reduce(
    (acc, d) => (d.fileUri ? acc + 1 : acc),
    0
  );

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

      {/* Main Scroll Content with ScrollView ref for scroll-to-top */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          currentStep >= 4 && { paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        overScrollMode="always"
        nestedScrollEnabled={true}
      >
        {currentStep === 0 && (
          <GstFilingPeriodStep
            data={periodData}
            errors={periodErrors}
            onChange={(fields) => {
              setPeriodData((prev) => ({ ...prev, ...fields }));
              setPeriodErrors((prev) => {
                const next = { ...prev };
                Object.keys(fields).forEach((k) => delete next[k]);
                return next;
              });
            }}
          />
        )}

        {currentStep === 1 && (
          <GstFilingDocumentsStep
            documents={documents}
            onUpdateDocuments={setDocuments}
            filingPeriodText={`${periodData.filingType ? periodData.filingType.split(" ")[0] : "GSTR-3B"} — ${periodData.filingPeriod || periodData.filingMonth || "Current Period"}`}
            filingNature={periodData.filingNature || "Regular Return"}
          />
        )}

        {currentStep === 2 && (
          <GstFilingReviewStep
            gstin={periodData.gstin || "29AAAAA0000A1Z5"}
            businessName={periodData.tradeName || periodData.businessName || "Shree Deshmukh Traders"}
            taxpayerScheme={periodData.taxpayerScheme || "Regular Scheme"}
            filingNature={periodData.filingNature || "Regular Return"}
            financialYear={periodData.financialYear || "FY 2025-26"}
            filingMonth={periodData.filingPeriod || periodData.filingMonth || "July 2026"}
            filingType={periodData.filingType || "GSTR-3B (Monthly Summary Return)"}
            filingFrequency={periodData.periodType || "Monthly"}
            uploadedDocsCount={uploadedDocsCount}
            onApprove={handleContinue}
            onRequestChanges={() =>
              Alert.alert(
                "Request Changes",
                "Your request has been forwarded to our Chartered Accountant. You will receive an updated return summary shortly."
              )
            }
          />
        )}

        {currentStep === 3 && (
          <GstPaymentMethodStep
            amount="₹2,344"
            selectedMethod={selectedMethod}
            onSelectMethod={setSelectedMethod}
            upiId={upiId}
            onChangeUpiId={(id) => {
              setUpiId(id);
              setUpiError("");
            }}
            upiError={upiError}
          />
        )}

        {currentStep === 4 && (
          <GstPaymentSuccessStep
            amount="₹2,344"
            serviceName={`GST Filing (${periodData.filingType ? periodData.filingType.split(" ")[0] : "GSTR-3B"})`}
            txnId={txnId || "TXN202608942"}
            paymentMethod={selectedMethod.toUpperCase()}
            filingPeriod={periodData.filingPeriod || periodData.filingMonth || "July 2026"}
            gstin={periodData.gstin || "29AAAAA0000A1Z5"}
            onViewReceipt={() => setCurrentStep(5)}
            onViewApplication={() => setCurrentStep(6)}
          />
        )}

        {currentStep === 5 && (
          <GstPaymentReceiptStep
            amount="₹2,344"
            serviceName={`GST Filing Service (${periodData.filingType ? periodData.filingType.split(" ")[0] : "GSTR-3B"})`}
            invoiceNo={`INV-2026-${(createdAppId || "84920").slice(-5)}`}
            gstin={periodData.gstin || "29AAAAA0000A1Z5"}
            period={periodData.filingPeriod || periodData.filingMonth || "July 2026"}
            txnId={txnId || "TXN202608942"}
            paymentMethod={selectedMethod.toUpperCase()}
          />
        )}

        {currentStep === 6 && (
          <GstApplicationStatusStep
            appId={createdAppId || "GST-2026-84920"}
            businessName={periodData.tradeName || periodData.businessName || (periodData.gstin ? `GSTIN: ${periodData.gstin}` : "Registered Business")}
            serviceName={`GST Filing (${periodData.filingPeriod || periodData.filingMonth || "Current Period"})`}
            appliedDate="Today"
            estCompletion="1-2 Business Days"
            isFilingWorkflow={true}
            onReuploadDocuments={() => setCurrentStep(1)}
          />
        )}

        {/* Action Button - Placed inside scroll content at the natural bottom */}
        {currentStep <= 3 && (
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

      {/* Universal Save As Draft Confirmation Modal (Matching Image 1) */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Filing Progress?"
        message="You have unsaved changes in your GST return filing. Save your progress so you can resume anytime without re-entering details."
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

export default GstFilingScreen;
