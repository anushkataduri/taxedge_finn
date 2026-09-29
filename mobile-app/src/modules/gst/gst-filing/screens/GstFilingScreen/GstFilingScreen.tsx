import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { GstFilingPeriodStep } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstFilingPeriodStep";
import { GstFilingDocumentsStep } from "@/modules/gst/gst-filing/components/GstFilingDocumentsStep/GstFilingDocumentsStep";
import { GstFilingReviewStep } from "@/modules/gst/gst-filing/components/GstFilingReviewStep/GstFilingReviewStep";
import { GstPaymentMethodStep } from "@/modules/gst/gst-filing/components/payment/GstPaymentMethodStep/GstPaymentMethodStep";
import { GstPaymentSuccessStep } from "@/modules/gst/gst-filing/components/payment/GstPaymentSuccessStep/GstPaymentSuccessStep";
import { GstPaymentReceiptStep } from "@/modules/gst/gst-filing/components/payment/GstPaymentReceiptStep/GstPaymentReceiptStep";
import { GstApplicationStatusStep } from "@/modules/gst/gst-status/components/GstApplicationStatusStep/GstApplicationStatusStep";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { KeyboardAwareScrollView } from "@/shared/components/KeyboardAwareFormLayout";
import { useApplicationStore } from "@/store/applicationStore";
import { applicationService } from "@/modules/applications/services/applicationService";
import { useGstFiling } from "../../hooks/useGstFiling";
import {
  styles,
  getHeaderBarStyle,
  getScrollContentStyle,
  getSubmitButtonStyle,
} from "./style";

export const GstFilingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
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
  } = useGstFiling();

  // Scroll to top on step transition
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentStep]);

  const handleComputationChange = (turnover: number, itc: number) => {
    setPeriodData((prev) => ({
      ...prev,
      taxableSales: String(turnover),
      turnover: String(turnover),
      eligibleItc: String(itc),
    }));
    if (createdAppId) {
      const existing = useApplicationStore
        .getState()
        .applications.find((a) => a.id === createdAppId);
      if (existing) {
        applicationService
          .updateApplication({
            ...existing,
            formData: {
              ...existing.formData,
              turnover: String(turnover),
              eligibleItc: String(itc),
            },
          })
          .catch(() => {});
      }
    }
  };

  const periodLabel =
    periodData.filingPeriod || periodData.filingMonth || "Current Period";
  const returnFormLabel = periodData.filingType
    ? periodData.filingType.split(" ")[0]
    : "GSTR-1";
  const businessDisplayName =
    periodData.tradeName || periodData.businessName || "Registered Business";

  return (
    <View style={styles.root}>
      {/* Top Header Bar */}
      <View style={[styles.headerBar, getHeaderBarStyle(insets.top)]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={BrandColors.TEXT_PRIMARY}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
        <View style={styles.placeholderBox} />
      </View>

      {/* Main Scroll Content */}
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          getScrollContentStyle(currentStep >= 4),
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
                const keys = Object.keys(fields);
                const omitKeys = (
                  curr: Record<string, string>,
                  idx = 0,
                ): Record<string, string> => {
                  if (idx >= keys.length) return curr;
                  const key = keys[idx];
                  if (curr[key]) {
                    const { [key]: _removed, ...rest } = curr;
                    return omitKeys(rest, idx + 1);
                  }
                  return omitKeys(curr, idx + 1);
                };
                return omitKeys(prev);
              });
            }}
          />
        )}

        {currentStep === 1 && (
          <GstFilingDocumentsStep
            documents={documents}
            onUpdateDocuments={handleUpdateDocuments}
            filingPeriodText={`${returnFormLabel} — ${periodLabel}`}
            filingNature={periodData.filingNature || "Regular Return"}
          />
        )}

        {currentStep === 2 && (
          <GstFilingReviewStep
            key={`${periodData.taxableSales || periodData.turnover || "0"}-${periodData.eligibleItc || "0"}`}
            gstin={periodData.gstin}
            businessName={businessDisplayName}
            taxpayerScheme={periodData.taxpayerScheme || "Regular Scheme"}
            filingNature={periodData.filingNature || "Regular Return"}
            financialYear={periodData.financialYear || "FY 2025-26"}
            filingMonth={periodLabel}
            filingType={periodData.filingType || "GSTR-1"}
            filingFrequency={periodData.periodType || "Monthly"}
            uploadedDocsCount={uploadedDocsCount}
            totalRequiredDocsCount={requiredDocs.length}
            missingDocsCount={missingDocsCount}
            grossTaxableTurnover={
              periodData.taxableSales || periodData.turnover || 0
            }
            eligibleItc={periodData.eligibleItc || 0}
            onEditFilingDetails={() => setCurrentStep(0)}
            onEditTaxComputation={() => setCurrentStep(0)}
            onEditFilingFee={() => setCurrentStep(3)}
            onEditDocuments={() => setCurrentStep(1)}
            onReuploadDocuments={() => setCurrentStep(1)}
            onUpdateComputation={handleComputationChange}
            onApprove={handleContinue}
            onRequestChanges={() =>
              Alert.alert(
                "Request Changes",
                "Your request has been forwarded to our Chartered Accountant. You will receive an updated return summary shortly.",
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
            serviceName={`GST Filing (${returnFormLabel})`}
            txnId="Not available"
            paymentMethod={selectedMethod.toUpperCase()}
            filingPeriod={periodLabel}
            gstin={periodData.gstin || "Not provided"}
            onViewReceipt={() => setCurrentStep(5)}
            onViewApplication={() => setCurrentStep(6)}
          />
        )}

        {currentStep === 5 && (
          <GstPaymentReceiptStep
            amount="₹2,344"
            serviceName={`GST Filing Service (${returnFormLabel})`}
            invoiceNo={
              createdAppId
                ? `INV-2026-${createdAppId.slice(-5)}`
                : "Not available"
            }
            gstin={periodData.gstin || "Not provided"}
            period={periodLabel}
            txnId="Not available"
            paymentMethod={selectedMethod.toUpperCase()}
          />
        )}

        {currentStep === 6 && (
          <GstApplicationStatusStep
            appId={createdAppId || "Not available"}
            businessName={
              periodData.tradeName ||
              periodData.businessName ||
              (periodData.gstin
                ? `GSTIN: ${periodData.gstin}`
                : "Registered Business")
            }
            serviceName={`GST Filing (${periodLabel})`}
            appliedDate="Today"
            estCompletion="1-2 Business Days"
            isFilingWorkflow={true}
            onReuploadDocuments={() => setCurrentStep(1)}
          />
        )}

        {/* Action Button */}
        {currentStep <= 3 && (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleContinue}
              style={getSubmitButtonStyle(isSubmitting)}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? "Saving..." : getButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>

      {/* Universal Save As Draft Confirmation Modal */}
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
