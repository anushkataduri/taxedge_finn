/**
 * Screen: GST Registration
 * Refactored: Modular Monolith architecture. Strictly UI only. No inline styles.
 */

import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";

import { GstStepIndicator } from "../../components/GstStepIndicator/GstStepIndicator";
import { GstBusinessStep } from "../../components/GstBusinessStep/GstBusinessStep";
import { GstUnifiedDocumentStep } from "../../components/GstUnifiedDocumentStep/GstUnifiedDocumentStep";
import { GstReviewStep } from "../../components/GstReviewStep/GstReviewStep";
import { GstRegistrationPaymentStep } from "../../components/GstRegistrationPaymentStep/GstRegistrationPaymentStep";
import { GstApplicationStatusStep } from "../../../gst-status/components/GstApplicationStatusStep/GstApplicationStatusStep";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";

import { useGstRegistrationFlow } from "../../hooks/useGstRegistrationFlow";
import { styles, getHeaderBarStyle } from "./GstRegistrationScreen.styles";

const STEPS = ["Business", "Documents", "Review", "Payment"];

const getScreenTitle = (index: number) => {
  const titles = [
    "GST Registration",
    "Upload Documents",
    "Review Application",
    "Service Payment",
    "Application Status",
  ];
  return titles[index] || titles[0];
};

const getButtonText = (index: number, isEditMode: boolean = false) => {
  if (isEditMode && (index === 0 || index === 1)) {
    return "Update & Review";
  }
  const texts = [
    "Continue to Documents",
    "Continue to Review",
    "Proceed to Payment (₹1,499)",
  ];
  return texts[index] || "";
};

export const GstRegistrationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
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
    isEditMode,
    handleEditStep,
    isFetchingReview,
  } = useGstRegistrationFlow(scrollViewRef);

  return (
    <View style={styles.root}>
      {/* Top Header Bar */}
      <View
        style={[styles.headerBar, getHeaderBarStyle(insets.top)]}
      >
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
        <Text style={styles.headerTitle}>{getScreenTitle(screenIndex)}</Text>
        <View style={styles.placeholderBox} />
      </View>

      {/* 4-Step Indicator */}
      {screenIndex < 4 && (
        <GstStepIndicator steps={STEPS} currentStep={screenIndex} />
      )}

      {/* Main Scroll Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          screenIndex === 4 ? styles.scrollPaddingBottom : null,
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
            onUpdateDocument={(docId, patch) => {
              const updated = documents.map((d) =>
                d.id === docId ? { ...d, ...patch } : d,
              );
              handleUpdateDocuments(updated);
            }}
          />
        )}

        {screenIndex === 2 && (
          <GstReviewStep
            businessData={businessData}
            documents={documents}
            onEditStep={handleEditStep}
            declared={declared}
            onToggleDeclaration={() => setDeclared((prev: boolean) => !prev)}
            isFetching={isFetchingReview}
          />
        )}

        {screenIndex === 3 && (
          <GstRegistrationPaymentStep
            businessName={
              businessData.businessName ||
              businessData.legalName ||
              "Your Business"
            }
            amount={1499}
            applicationId={createdGstId || "GST-REG"}
            onPaymentSuccess={handlePaymentSuccess}
            onBackToReview={() => setScreenIndex(2)}
          />
        )}

        {screenIndex === 4 && (
          <GstApplicationStatusStep
            appId={createdGstId || createdAppId || businessData.gstId}
            businessName={businessData.businessName || "Your Business"}
            appliedDate="Today"
            serviceName="GST Registration"
          />
        )}

        {/* Action Button */}
        {screenIndex < 3 && (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleContinue}
              style={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {getButtonText(screenIndex, isEditMode)}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Universal Save As Draft Confirmation Modal */}
      <UniversalDraftModal
        visible={draftGuard.showDraftModal}
        title="Save Application Progress?"
        message="You have unsaved changes. Save your progress so you can resume anytime without re-entering details."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={draftGuard.handleSaveAndExit}
        onDiscardAndExit={draftGuard.handleDiscardAndExit}
        onCancel={draftGuard.handleCancel}
      />
    </View>
  );
};

export default GstRegistrationScreen;
