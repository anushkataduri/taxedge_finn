import React, { useState, useRef, useCallback } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../../../authentication/store/authStore";
import { useApplicationStore } from "../../../../../store/applicationStore";
import { loansApi } from "../../../services/loansApi";
import { MACHINERY_DOCUMENTS_TEMPLATE } from "../../../mock/loanServices";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanApplicationDraft,
} from "../../../types/loans.types";
import { useLoanWizard } from "../../../hooks/useLoanWizard";
import { useLoanDocuments } from "../../../hooks/useLoanDocuments";
import { LoanProgressHeader, LOAN_PROGRESS_CONFIG } from "@/shared/components/LoanProgressHeader";
import { LoanNavigation } from "@/shared/components/LoanNavigation";
import { getBottomBarPadding, getSafeAreaTopPadding } from "../../../styles/loanScreenLayout.styles";
import {
  MachineryLoanFinancialsStep,
  MachineryLoanBankingStep,
  MachineryLoanDocumentsStep,
  MachineryLoanReviewStep,
} from "../../components";
import {
  initialLoanDetails,
  initialBusinessDetails,
  initialBankingDetails,
  validateMachineryStep,
} from "../../utils/machineryLoanValidators";
import { styles } from "./MachineryLoanScreen.styles";

const STEPS = LOAN_PROGRESS_CONFIG.machinery.steps;

export const MachineryLoanScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const customer = useAuthStore((s) => s.customer);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loanDetails, setLoanDetails] = useState<LoanDetailsFormData>(initialLoanDetails);
  const [businessDetails, setBusinessDetails] = useState<LoanBusinessFormData>(initialBusinessDetails);
  const [bankingDetails, setBankingDetails] = useState<LoanBankingFormData>(initialBankingDetails);

  const loanDocuments = useLoanDocuments({ template: MACHINERY_DOCUMENTS_TEMPLATE });
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

  function validateStep(stepIndex: number): boolean {
    const result = validateMachineryStep({
      stepIndex,
      loanDetails,
      businessDetails,
      bankingDetails,
      documents,
    });
    setErrors(result.errors);
    return result.isValid;
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
        "Please check the authorization declaration to submit your Machinery Loan application."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const draftPayload: Partial<LoanApplicationDraft> = {
        loanType: "Machinery Loan",
        loanTypeId: "machinery-loan",
        customerProfile: customer || undefined,
        loanDetails,
        businessDetails,
        bankingDetails,
        documents,
      };

      const response = await loansApi.applyLoan(draftPayload);
      const appId = response.applicationId || `MCH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      const appStore = useApplicationStore.getState();
      const amountVal = Number(loanDetails.requiredAmount) || 3000000;
      appStore.createApplication(
        "machinery-loan",
        "Machinery Loan",
        "LOANS",
        {
          loanType: "Machinery Loan",
          requestedAmount: amountVal,
          equipmentType: loanDetails.customEquipmentType || loanDetails.purpose,
          tenureMonths: loanDetails.preferredTenureMonths,
          businessName: businessDetails.businessName,
          businessType: businessDetails.businessType,
          businessVintage: businessDetails.businessVintageYears,
          annualTurnover: businessDetails.annualTurnover,
          isGstRegistered: businessDetails.isGstRegistered,
          gstin: businessDetails.gstin,
          bankName: bankingDetails.primaryBankName,
          accountNumber: bankingDetails.accountNumber,
          ifscCode: bankingDetails.ifscCode,
        },
        documents.map((d) => ({
          name: d.name,
          status: d.fileUri ? "Uploaded" : "Pending",
          fileUri: d.fileUri,
        })),
        0,
        "Paid",
        true
      );

      const statusRoute: Href = `/service/loan-status?id=${appId}&loanType=Machinery+Loan`;
      Alert.alert(
        "Machinery Loan Submitted",
        `Your application (Ref: ${response.referenceNumber || appId}) has been submitted. Our TaxEdge Loan Agent will process the application shortly.`,
        [{ text: "Track Status", onPress: () => router.replace(statusRoute) }]
      );
    } catch {
      Alert.alert("Submission Error", "Failed to lodge application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderActiveStep = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <MachineryLoanFinancialsStep
            data={loanDetails}
            onChange={handleDetailsChange}
            businessData={businessDetails}
            onBusinessChange={handleBusinessChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <MachineryLoanBankingStep
            data={bankingDetails}
            onChange={handleBankingChange}
            errors={errors}
            hasExistingLoans={false}
          />
        );
      case 2:
        return <MachineryLoanDocumentsStep loanDocuments={loanDocuments} />;
      case 3:
      default:
        return (
          <MachineryLoanReviewStep
            loanDetails={loanDetails}
            businessDetails={businessDetails}
            bankingDetails={bankingDetails}
            documents={documents}
            isConsentChecked={isConsentChecked}
            onConsentToggle={setIsConsentChecked}
            onGoToStep={wizard.goToStep}
          />
        );
    }
  };

  return (
    <View style={[styles.safeArea, getSafeAreaTopPadding(insets.top)]}>
      {/* Unified Progress Header */}
      <LoanProgressHeader
        title={LOAN_PROGRESS_CONFIG.machinery.title}
        currentStep={currentStepIndex + 1}
        totalSteps={STEPS.length}
        subtitle={STEPS[currentStepIndex]}
        onBack={wizard.handleBack}
      />

      {/* Scrollable Step Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderActiveStep()}
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <LoanNavigation
        onNext={handleNext}
        isFirstStep={wizard.isFirstStep}
        isLastStep={wizard.isLastStep}
        isSubmitting={isSubmitting}
        containerStyle={getBottomBarPadding(insets.bottom)}
      />
    </View>
  );
};

export default MachineryLoanScreen;
