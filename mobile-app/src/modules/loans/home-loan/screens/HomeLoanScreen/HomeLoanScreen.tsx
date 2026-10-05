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
import { HOME_LOAN_DOCUMENTS_TEMPLATE } from "../../../mock/loanServices";
import type { HomeLoanDraftData } from "../../services/homeLoanDraftService";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanApplicationDraft,
} from "../../../types/loans.types";
import { useLoanWizard } from "../../../hooks/useLoanWizard";
import { useLoanDocuments } from "../../../hooks/useLoanDocuments";
import { useLoanDraft } from "../../../hooks/useLoanDraft";
import { LOAN_DRAFT_STORAGE_KEYS } from "../../../constants/loanDraftKeys";
import { LoanStepIndicator } from "../../../components/LoanStepIndicator";
import { getBottomBarPadding, getSafeAreaTopPadding } from "../../../styles/loanScreenLayout.styles";
import {
  HomeLoanFinancialsStep,
  HomeLoanEmploymentStep,
  HomeLoanBankingStep,
  HomeLoanDocumentsStep,
  HomeLoanReviewStep,
} from "../../components";
import { styles } from "./HomeLoanScreen.styles";

const STEPS = [
  "Loan Requirements",
  "Employment & Income",
  "Banking & ITR",
  "Document Dossier",
  "Review & Lodgement",
] as const;

const INITIAL_LOAN_DETAILS: LoanDetailsFormData = {
  loanType: "Home Loan",
  requiredAmount: "",
  purpose: "",
  customPurpose: "",
  propertyStage: undefined,
  estimatedPropertyValue: "",
  preferredTenureMonths: "",
  hasExistingLoans: false,
  existingEmi: "",
  monthlyIncomeOrTurnover: "",
  employmentType: "" as any,
};

const INITIAL_BUSINESS_DETAILS: LoanBusinessFormData = {
  businessName: "",
  gstin: "",
  udyamRegistration: "",
  businessVintageYears: "",
  annualTurnover: "",
  netProfit: "",
};

const INITIAL_BANKING_DETAILS: LoanBankingFormData = {
  primaryBankName: "",
  accountNumber: "",
  ifscCode: "",
  existingLenderName: "",
  existingLoanOutstanding: "",
  itrFilingStatus: "" as any,
  itrAckNumber: "",
  grossTotalIncome: "",
};

/** The saved draft without its timestamp, which the draft storage adds on save. */
type HomeLoanDraft = Omit<HomeLoanDraftData, "savedAt">;

export const HomeLoanScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const customer = useAuthStore((s) => s.customer);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State initialized to empty & unselected
  const [loanDetails, setLoanDetails] = useState<LoanDetailsFormData>(INITIAL_LOAN_DETAILS);
  const [businessDetails, setBusinessDetails] = useState<LoanBusinessFormData>(INITIAL_BUSINESS_DETAILS);
  const [bankingDetails, setBankingDetails] = useState<LoanBankingFormData>(INITIAL_BANKING_DETAILS);

  // Word/Excel files stay accepted, as in the original Files/Drive picker of this flow.
  const loanDocuments = useLoanDocuments({
    template: HOME_LOAN_DOCUMENTS_TEMPLATE,
    fileTypes: "withOfficeDocuments",
  });
  const { documents } = loanDocuments;

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const wizard = useLoanWizard({
    totalSteps: STEPS.length,
    validateStep: (stepIndex) => validateStep(stepIndex),
    onExitFromFirstStep: () => (isFormDirty() ? openDraftModal() : router.back()),
    onStepChange: scrollToTop,
  });
  const { currentStepIndex } = wizard;

  // Restore saved draft on mount if exists
  const draft = useLoanDraft<HomeLoanDraft>({
    storageKey: LOAN_DRAFT_STORAGE_KEYS.homeLoan,
    restoreOnMount: true,
    onRestore: (savedDraft) => {
      setLoanDetails(savedDraft.loanDetails);
      setBusinessDetails(savedDraft.businessDetails);
      setBankingDetails(savedDraft.bankingDetails);
      loanDocuments.setDocuments(savedDraft.documents);
      wizard.goToStep(savedDraft.currentStepIndex || 0);
    },
  });

  const resetAllFields = () => {
    setLoanDetails(INITIAL_LOAN_DETAILS);
    setBusinessDetails(INITIAL_BUSINESS_DETAILS);
    setBankingDetails(INITIAL_BANKING_DETAILS);
    loanDocuments.resetDocuments();
    wizard.resetWizard();
    setErrors({});
  };

  const isFormDirty = useCallback((): boolean => {
    const hasAmount = Boolean(loanDetails.requiredAmount.trim());
    const hasPurpose = Boolean(loanDetails.purpose.trim());
    const hasTenure = Boolean(loanDetails.preferredTenureMonths);
    const hasEmp = Boolean(loanDetails.employmentType);
    const hasIncome = Boolean(loanDetails.monthlyIncomeOrTurnover.trim());
    const hasBank = Boolean(
      bankingDetails.primaryBankName.trim() ||
      bankingDetails.accountNumber.trim() ||
      bankingDetails.ifscCode.trim()
    );
    const hasDocs = documents.some((d) => Boolean(d.fileUri));
    return hasAmount || hasPurpose || hasTenure || hasEmp || hasIncome || hasBank || hasDocs || currentStepIndex > 0;
  }, [loanDetails, bankingDetails, documents, currentStepIndex]);

  // Universal Draft Guard Hook for Step 1 back button & gestures
  const {
    showDraftModal,
    openDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: isFormDirty,
    onSaveDraft: () => {
      draft.saveDraft({
        currentStepIndex,
        loanDetails,
        businessDetails,
        bankingDetails,
        documents,
      });
    },
    onDiscardDraft: () => {
      draft.clearDraft();
      resetAllFields();
    },
    isSubmitted: () => currentStepIndex >= 4 && isSubmitting,
  });

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
    if (stepIndex === 0) {
      const errs: Record<string, string> = {};
      const amountNum = Number(loanDetails.requiredAmount);
      if (!loanDetails.requiredAmount || isNaN(amountNum) || amountNum < 10000) {
        errs.requiredAmount = "Enter a valid required loan amount (minimum ₹10,000)";
      }
      if (!loanDetails.purpose || loanDetails.purpose.trim() === "") {
        errs.purpose = "Please select a property intent / purpose";
      } else if (
        loanDetails.purpose === "Others" &&
        (!loanDetails.customPurpose || loanDetails.customPurpose.trim() === "")
      ) {
        errs.customPurpose = "Please specify your custom property intent";
      }
      if (!loanDetails.preferredTenureMonths) {
        errs.preferredTenureMonths = "Please select a repayment tenure";
      }
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        Alert.alert(
          "Required Details Missing",
          "Please enter a loan amount, select a property purpose, and choose a repayment tenure to continue."
        );
        return false;
      }
      return true;
    }

    if (stepIndex === 1) {
      const errs: Record<string, string> = {};
      if (!loanDetails.employmentType) {
        errs.employmentType = "Please select an employment category";
      }
      const incomeStr = loanDetails.monthlyIncomeOrTurnover?.trim();
      const incomeNum = Number(incomeStr);
      if (
        !incomeStr ||
        (!isNaN(incomeNum) && incomeNum <= 0)
      ) {
        errs.monthlyIncomeOrTurnover = "Please select or enter monthly net income";
      }
      if (loanDetails.hasExistingLoans) {
        const emiNum = Number(loanDetails.existingEmi);
        if (!loanDetails.existingEmi || isNaN(emiNum) || emiNum <= 0) {
          errs.existingEmi = "Please specify ongoing monthly EMI amount";
        }
      }

      if (
        loanDetails.employmentType === "Business Owner" &&
        (!businessDetails.businessName || businessDetails.businessName.trim() === "")
      ) {
        errs.businessName = "Business name is required for business owners";
      }

      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        Alert.alert(
          "Incomplete Profile",
          "Please select an employment category and enter your monthly net income to continue."
        );
        return false;
      }
      return true;
    }

    if (stepIndex === 2) {
      const errs: Record<string, string> = {};
      if (!bankingDetails.primaryBankName || bankingDetails.primaryBankName.trim() === "") {
        errs.primaryBankName = "Primary bank name is required";
      }
      if (!bankingDetails.accountNumber || bankingDetails.accountNumber.trim().length < 6) {
        errs.accountNumber = "Valid bank account number is required (min 6 digits)";
      }
      if (!bankingDetails.ifscCode || bankingDetails.ifscCode.trim().length < 11) {
        errs.ifscCode = "Valid 11-digit IFSC code is required";
      }
      if (!bankingDetails.itrFilingStatus) {
        errs.itrFilingStatus = "Please select an ITR filing status";
      }
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        Alert.alert(
          "Banking Details Missing",
          "Please enter your bank name, account number, IFSC code, and select ITR status to continue."
        );
        return false;
      }
      return true;
    }

    if (stepIndex === 3) {
      const { isValid, missingDocs } = loanDocuments.validateDocuments();
      if (!isValid) {
        Alert.alert(
          "Mandatory Documents Required",
          `Please upload all required housing finance documents to continue:\n\n• ${missingDocs.slice(0, 3).join("\n• ")}`
        );
        return false;
      }
      return true;
    }

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
        "Please check the authorization declaration to lodge your home loan."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const application: Partial<LoanApplicationDraft> = {
        loanType: "Home Loan",
        loanTypeId: "home-loan",
        customerProfile: customer || undefined,
        loanDetails,
        businessDetails:
          loanDetails.employmentType !== "Salaried"
            ? businessDetails
            : undefined,
        bankingDetails,
        documents,
      };

      const response = await loansApi.applyLoan(application);
      markSubmitted();
      await draft.clearDraft();

      const statusRoute: Href = `/service/loan-status?id=${response.applicationId}&loanType=Home+Loan&isSuccess=true`;
      router.replace(statusRoute);
    } catch {
      Alert.alert(
        "Submission Error",
        "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderActiveStep = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <HomeLoanFinancialsStep
            data={loanDetails}
            onChange={handleDetailsChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <HomeLoanEmploymentStep
            data={loanDetails}
            onChangeDetails={handleDetailsChange}
            businessData={businessDetails}
            onChangeBusiness={handleBusinessChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <HomeLoanBankingStep
            data={bankingDetails}
            onChange={handleBankingChange}
            errors={errors}
            hasExistingLoans={loanDetails.hasExistingLoans}
          />
        );
      case 3:
        return <HomeLoanDocumentsStep loanDocuments={loanDocuments} />;
      case 4:
      default:
        return (
          <HomeLoanReviewStep
            loanDetails={loanDetails}
            businessDetails={
              loanDetails.employmentType !== "Salaried"
                ? businessDetails
                : undefined
            }
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
        title="Home Loan"
        subtitle={STEPS[currentStepIndex]}
        currentStepIndex={currentStepIndex}
        totalSteps={STEPS.length}
        onBack={wizard.handleBack}
        onSettings={() =>
          Alert.alert(
            "Home Loan Assistance",
            "Need help with your home loan application? Contact support@taxedge.in or your assigned credit officer."
          )
        }
      />

      {/* Scrollable Step Content (Modular Card Layout) */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderActiveStep()}
      </ScrollView>

      {/* Sticky Bottom Navigation with Orange Theme */}
      <View style={[styles.bottomBar, getBottomBarPadding(insets.bottom)]}>
        <TouchableOpacity
          style={[styles.nextButton, isSubmitting && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={BrandColors.WHITE} />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
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

      {/* Universal Draft Modal on Back Navigation / Gesture */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Home Loan Draft?"
        message="You have entered information for your home loan. Save your progress to resume anytime without re-entering details."
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default HomeLoanScreen;
