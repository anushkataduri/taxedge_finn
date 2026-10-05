import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { useAuthStore } from "../../../../authentication/store/authStore";
import { loansApi } from "../../../services/loansApi";
import { BUSINESS_DOCUMENTS_TEMPLATE } from "../../../mock/loanServices";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanApplicationDraft,
} from "../../../types/loans.types";
import {
  validateLoanDetails,
  validateLoanBusiness,
  validateLoanBanking,
} from "../../../validation/loansSchema";
import { useLoanWizard } from "../../../hooks/useLoanWizard";
import { useLoanDocuments } from "../../../hooks/useLoanDocuments";
import { LoanStepIndicator } from "../../../components/LoanStepIndicator";
import { getBottomBarPadding, getSafeAreaTopPadding } from "../../../styles/loanScreenLayout.styles";
import {
  BusinessLoanFinancialsStep,
  BusinessLoanBusinessStep,
  BusinessLoanBankingStep,
  BusinessLoanDocumentsStep,
  BusinessLoanReviewStep,
} from "../../components";
import { styles } from "./BusinessLoanScreen.styles";

const STEPS = ["Loan & Applicant", "Business", "Banking", "Documents", "Review"] as const;
/** Upload limit of the pickers this flow used before (5 MB, Office files included). */
const BUSINESS_LOAN_MAX_FILE_SIZE_MB = 5;
const SUBMISSION_FALLBACK_MESSAGE =
  "Failed to lodge application. Please check your network connection and try again.";

/** Server message of an HTTP-style error (`response.data.message`), else the error's own message. */
const getSubmissionErrorMessage = (error: unknown): string => {
  if (typeof error !== "object" || error === null) return SUBMISSION_FALLBACK_MESSAGE;
  const response = "response" in error ? error.response : undefined;
  const data =
    typeof response === "object" && response !== null && "data" in response ? response.data : undefined;
  const serverMessage =
    typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
      ? data.message
      : "";
  const ownMessage = "message" in error && typeof error.message === "string" ? error.message : "";
  return serverMessage || ownMessage || SUBMISSION_FALLBACK_MESSAGE;
};

export const BusinessLoanScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const customer = useAuthStore((s) => s.customer);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Loan & Applicant
  const [loanDetails, setLoanDetails] = useState<LoanDetailsFormData>({
    loanType: "Business Loan",
    requiredAmount: "",
    purpose: "",
    preferredTenureMonths: "",
    hasExistingLoans: false,
    existingEmi: "",
    monthlyIncomeOrTurnover: "",
    employmentType: "Business Owner",
  });

  // Step 2: Business details
  const [businessDetails, setBusinessDetails] = useState<LoanBusinessFormData>({
    businessName: "",
    businessConstitution: "",
    gstin: "",
    hasUdyam: false,
    udyamRegistration: "",
    businessVintageYears: "",
    annualTurnover: "",
    netProfit: "",
    signatoryName: "",
    signatoryDesignation: "",
    signatoryEmail: "",
  });

  // Step 3: Banking
  const [bankingDetails, setBankingDetails] = useState<LoanBankingFormData>({
    primaryBankName: "",
    accountNumber: "",
    ifscCode: "",
    existingLenderName: "",
    existingLoanOutstanding: "",
    itrFilingStatus: "Not Filed",
    itrAckNumber: "",
    grossTotalIncome: "",
  });

  // Step 4: Documents — PDF, images, Word and Excel, 5 MB per file on every picker.
  const loanDocuments = useLoanDocuments({
    template: BUSINESS_DOCUMENTS_TEMPLATE,
    fileTypes: "withOfficeDocuments",
    maxSizeMB: BUSINESS_LOAN_MAX_FILE_SIZE_MB,
    enforceSizeLimitOnOfficeFiles: true,
  });
  const { documents } = loanDocuments;

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const wizard = useLoanWizard({
    totalSteps: STEPS.length,
    validateStep: (stepIndex) => validateStep(stepIndex),
    onExitFromFirstStep: () => router.back(),
    onStepChange: scrollToTop,
  });
  const { currentStepIndex } = wizard;

  const clearFieldError = (field: string) => {
    if (!errors[field]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleDetailsChange = <K extends keyof LoanDetailsFormData>(field: K, value: LoanDetailsFormData[K]) => {
    setLoanDetails((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleBusinessChange = <K extends keyof LoanBusinessFormData>(field: K, value: LoanBusinessFormData[K]) => {
    setBusinessDetails((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleBankingChange = <K extends keyof LoanBankingFormData>(field: K, value: LoanBankingFormData[K]) => {
    setBankingDetails((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  /** Shows the step's field errors plus an alert; returns false so the wizard stays put. */
  const rejectStep = (stepErrors: Record<string, string>, message: string): false => {
    setErrors(stepErrors);
    Alert.alert("Required Fields Missing", message);
    return false;
  };

  function validateStep(stepIndex: number): boolean {
    if (stepIndex === 0) {
      const step1Errors = validateLoanDetails(loanDetails, { requireExistingEmi: false });
      if (Object.keys(step1Errors).length > 0) {
        return rejectStep(step1Errors, "Please fill in all required fields in Step 1 before proceeding.");
      }
    } else if (stepIndex === 1) {
      const step2Errors = validateLoanBusiness(businessDetails);
      if (Object.keys(step2Errors).length > 0) {
        return rejectStep(step2Errors, "Please fill in all required fields in Step 2 before proceeding.");
      }
    } else if (stepIndex === 2) {
      const step3Errors = validateLoanBanking(bankingDetails);
      if (Object.keys(step3Errors).length > 0) {
        return rejectStep(
          step3Errors,
          "Please fill in all required banking details (Bank Name, Account Number, IFSC) in Step 3 before proceeding."
        );
      }
    } else if (stepIndex === 3) {
      // Business Loan only requires at least one uploaded document to reach the review.
      const uploadedDocs = documents.filter((d) => d.fileUri && d.fileUri.trim() !== "");
      if (uploadedDocs.length === 0) {
        Alert.alert(
          "Document Required",
          "Please upload at least one required document in Step 4 before proceeding to the review page."
        );
        return false;
      }
    }
    setErrors({});
    return true;
  }

  const handleNext = () => {
    if (!wizard.isLastStep) {
      wizard.goToNextStep();
      return;
    }
    if (validateStep(currentStepIndex)) {
      handleSubmitApplication();
    }
  };

  const handleSubmitApplication = async () => {
    if (!isConsentChecked) {
      Alert.alert(
        "Consent Required",
        "Please check the authorization declaration to lodge your business loan."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const draft: Partial<LoanApplicationDraft> = {
        loanType: "Business Loan",
        loanTypeId: "business-loan",
        customerProfile: customer || undefined,
        loanDetails,
        businessDetails,
        bankingDetails,
        documents,
      };

      const response = await loansApi.applyLoan(draft);
      Alert.alert(
        "Business Loan Lodged",
        `Your application (Ref: ${response.referenceNumber}) has been submitted. Our commercial credit assessment team will review your file shortly.`,
        [
          {
            text: "Track Status",
            onPress: () => {
              const statusUrl: Href = `/service/loan-status?id=${encodeURIComponent(
                response.applicationId
              )}&loanType=${encodeURIComponent("Business Loan")}`;
              router.replace(statusUrl);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Submission Error", getSubmissionErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderActiveStep = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <BusinessLoanFinancialsStep
            data={loanDetails}
            onChange={handleDetailsChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <BusinessLoanBusinessStep
            data={businessDetails}
            onChange={handleBusinessChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <BusinessLoanBankingStep
            data={bankingDetails}
            onChange={handleBankingChange}
            errors={errors}
            hasExistingLoans={loanDetails.hasExistingLoans}
          />
        );
      case 3:
        return <BusinessLoanDocumentsStep loanDocuments={loanDocuments} />;
      case 4:
      default:
        return (
          <BusinessLoanReviewStep
            loanDetails={loanDetails}
            businessDetails={businessDetails}
            bankingDetails={bankingDetails}
            documents={documents}
            profile={customer || undefined}
            isConsentChecked={isConsentChecked}
            onConsentToggle={setIsConsentChecked}
            onGoToStep={wizard.goToStep}
          />
        );
    }
  };

  return (
    <View style={[styles.safeArea, getSafeAreaTopPadding(insets.top)]}>
      {/* Header with Step X of 5 & Orange Linear Progress Bar */}
      <LoanStepIndicator
        variant="linear"
        title="Business Loan"
        subtitle={STEPS[currentStepIndex]}
        currentStepIndex={currentStepIndex}
        totalSteps={STEPS.length}
        onBack={wizard.handleBack}
        onSettings={() =>
          Alert.alert(
            "Business Loan Assistance",
            "Need help with your business loan application? Contact support@taxedge.in or your assigned credit officer."
          )
        }
      />

      {/* Scrollable Form Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderActiveStep()}
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.bottomBar, getBottomBarPadding(insets.bottom)]}>
        <TouchableOpacity
          style={[styles.continueBtn, isSubmitting && styles.continueBtnDisabled]}
          onPress={handleNext}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={BrandColors.WHITE} />
          ) : (
            <>
              <Text style={styles.continueBtnText}>
                {wizard.isLastStep ? "Submit Application" : "Continue"}
              </Text>
              <Ionicons
                name={wizard.isLastStep ? "shield-checkmark" : "arrow-forward"}
                size={18}
                color={BrandColors.WHITE}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BusinessLoanScreen;
