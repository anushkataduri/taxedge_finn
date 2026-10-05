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
import { VEHICLE_LOAN_DOCUMENTS_TEMPLATE } from "../../constants/vehicleLoanDocuments";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import {
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanApplicationDraft,
} from "../../../types/loans.types";
import {
  VehicleLoanDetailsFormData,
  VehicleLoanDraftData,
} from "../../types/vehicleLoan.types";
import { useLoanWizard } from "../../../hooks/useLoanWizard";
import { useLoanDocuments } from "../../../hooks/useLoanDocuments";
import { useLoanDraft } from "../../../hooks/useLoanDraft";
import { LOAN_DRAFT_STORAGE_KEYS } from "../../../constants/loanDraftKeys";
import { LoanStepIndicator } from "../../../components/LoanStepIndicator";
import { getBottomBarPadding, getSafeAreaTopPadding } from "../../../styles/loanScreenLayout.styles";
import {
  VehicleLoanFinancialsStep,
  VehicleLoanEmploymentStep,
  VehicleLoanBankingStep,
  VehicleLoanDocumentsStep,
  VehicleLoanReviewStep,
} from "../../components";
import { styles } from "./VehicleLoanScreen.styles";

const STEPS = [
  "Vehicle & Loan Requirements",
  "Employment & Income",
  "Banking & ITR",
  "Document Dossier",
  "Review & Lodgement",
] as const;

const INITIAL_LOAN_DETAILS: VehicleLoanDetailsFormData = {
  loanType: "Vehicle Loan",
  requiredAmount: "",
  purpose: "",
  customPurpose: "",
  vehicleCondition: undefined,
  vehicleMakeModel: "",
  onRoadPrice: "",
  downPayment: "",
  registrationNumber: "",
  registrationYear: "",
  preferredTenureMonths: "",
  hasExistingLoans: false,
  existingEmi: "",
  monthlyIncomeOrTurnover: "",
  employmentType: "" as any,
};

const INITIAL_BUSINESS_DETAILS: LoanBusinessFormData = {
  businessName: "", gstin: "", udyamRegistration: "", businessVintageYears: "", annualTurnover: "", netProfit: "",
};

const INITIAL_BANKING_DETAILS: LoanBankingFormData = {
  primaryBankName: "", accountNumber: "", ifscCode: "", existingLenderName: "", existingLoanOutstanding: "",
  itrFilingStatus: "" as any, itrAckNumber: "", grossTotalIncome: "",
};

/** The saved draft without its timestamp, which the draft storage adds on save. */
type VehicleLoanDraft = Omit<VehicleLoanDraftData, "savedAt">;

export const VehicleLoanScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const customer = useAuthStore((s) => s.customer);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State initialized to empty & unselected
  const [loanDetails, setLoanDetails] =
    useState<VehicleLoanDetailsFormData>(INITIAL_LOAN_DETAILS);
  const [businessDetails, setBusinessDetails] =
    useState<LoanBusinessFormData>(INITIAL_BUSINESS_DETAILS);
  const [bankingDetails, setBankingDetails] =
    useState<LoanBankingFormData>(INITIAL_BANKING_DETAILS);

  // Word/Excel files stay accepted, as in the original Files/Drive picker of this flow.
  const loanDocuments = useLoanDocuments({
    template: VEHICLE_LOAN_DOCUMENTS_TEMPLATE,
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

  // Restore saved draft on mount if exists (key "@taxedge_vehicle_loan_draft_v1")
  const draft = useLoanDraft<VehicleLoanDraft>({
    storageKey: LOAN_DRAFT_STORAGE_KEYS.vehicleLoan,
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
    const hasAmount = Boolean(loanDetails.requiredAmount?.trim());
    const hasPurpose = Boolean(loanDetails.purpose?.trim());
    const hasCondition = Boolean(loanDetails.vehicleCondition);
    const hasMake = Boolean(loanDetails.vehicleMakeModel?.trim());
    const hasPrice = Boolean(loanDetails.onRoadPrice?.trim());
    const hasTenure = Boolean(loanDetails.preferredTenureMonths);
    const hasEmp = Boolean(loanDetails.employmentType);
    const hasIncome = Boolean(loanDetails.monthlyIncomeOrTurnover?.trim());
    const hasBank = Boolean(bankingDetails.primaryBankName?.trim() || bankingDetails.accountNumber?.trim() || bankingDetails.ifscCode?.trim());
    const hasDocs = documents.some((d) => Boolean(d.fileUri));
    return hasAmount || hasPurpose || hasCondition || hasMake || hasPrice || hasTenure || hasEmp || hasIncome || hasBank || hasDocs || currentStepIndex > 0;
  }, [loanDetails, bankingDetails, documents, currentStepIndex]);

  const {
    showDraftModal, openDraftModal, markSubmitted, handleSaveAndExit, handleDiscardAndExit, handleCancel,
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

  const handleDetailsChange = <K extends keyof VehicleLoanDetailsFormData>(
    field: K,
    value: VehicleLoanDetailsFormData[K]
  ) => {
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
        errs.requiredAmount =
          "Enter a valid required loan amount (minimum ₹10,000)";
      }
      if (!loanDetails.purpose || loanDetails.purpose.trim() === "") {
        errs.purpose = "Please select a vehicle category / purpose";
      } else if (
        loanDetails.purpose === "Others" &&
        (!loanDetails.customPurpose || loanDetails.customPurpose.trim() === "")
      ) {
        errs.customPurpose = "Please specify custom vehicle requirement";
      }
      if (!loanDetails.preferredTenureMonths) {
        errs.preferredTenureMonths = "Please select a repayment tenure";
      }
      if (!loanDetails.vehicleCondition) {
        errs.vehicleCondition = "Please select vehicle condition (New or Pre-Owned)";
      }
      if (!loanDetails.vehicleMakeModel || loanDetails.vehicleMakeModel.trim() === "") {
        errs.vehicleMakeModel = "Please enter vehicle make and model";
      }
      const priceNum = Number(loanDetails.onRoadPrice);
      if (!loanDetails.onRoadPrice || isNaN(priceNum) || priceNum <= 0) {
        errs.onRoadPrice = "Please enter estimated on-road price / valuation";
      }

      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        Alert.alert("Required Details Missing", "Please enter loan amount, vehicle category, tenure, and vehicle details to continue.");
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
        errs.monthlyIncomeOrTurnover = "Please select or enter monthly in-hand net income";
      }
      if (loanDetails.hasExistingLoans) {
        const emiNum = Number(loanDetails.existingEmi);
        if (!loanDetails.existingEmi || isNaN(emiNum) || emiNum <= 0) {
          errs.existingEmi = "Please specify ongoing monthly EMI obligations";
        }
      }

      if (
        loanDetails.employmentType === "Business Owner" &&
        (!businessDetails.businessName ||
          businessDetails.businessName.trim() === "")
      ) {
        errs.businessName = "Business name is required for business owners";
      }

      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        Alert.alert("Incomplete Profile", "Please select an employment category and enter your monthly net income to continue.");
        return false;
      }
      return true;
    }

    if (stepIndex === 2) {
      const errs: Record<string, string> = {};
      if (
        !bankingDetails.primaryBankName ||
        bankingDetails.primaryBankName.trim() === ""
      ) {
        errs.primaryBankName = "Primary operating bank name is required";
      }
      if (
        !bankingDetails.accountNumber ||
        bankingDetails.accountNumber.trim().length < 6
      ) {
        errs.accountNumber =
          "Valid bank account number is required (min 6 digits)";
      }
      if (
        !bankingDetails.ifscCode ||
        bankingDetails.ifscCode.trim().length < 11
      ) {
        errs.ifscCode = "Valid 11-digit bank IFSC code is required";
      }
      if (!bankingDetails.itrFilingStatus) {
        errs.itrFilingStatus = "Please select an ITR filing status";
      }
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        Alert.alert("Banking Details Missing", "Please enter your bank name, account number, IFSC code, and select ITR status to continue.");
        return false;
      }
      return true;
    }

    if (stepIndex === 3) {
      const { isValid, missingDocs } = loanDocuments.validateDocuments();
      if (!isValid) {
        Alert.alert("Mandatory Documents Required", `Please upload all required vehicle financing documents to continue:\n\n• ${missingDocs.slice(0, 3).join("\n• ")}`);
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
      Alert.alert("Consent Required", "Please check the authorization declaration to lodge your vehicle loan.");
      return;
    }
    setIsSubmitting(true);
    try {
      const application: Partial<LoanApplicationDraft> = {
        loanType: "Vehicle Loan",
        loanTypeId: "vehicle-loan",
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

      const statusRoute: Href = `/service/loan-status?id=${response.applicationId}&loanType=Vehicle+Loan&isSuccess=true`;
      router.replace(statusRoute);
    } catch {
      Alert.alert("Submission Error", "Failed to lodge vehicle loan application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderActiveStep = () => {
    switch (currentStepIndex) {
      case 0:
        return <VehicleLoanFinancialsStep data={loanDetails} onChange={handleDetailsChange} errors={errors} />;
      case 1:
        return <VehicleLoanEmploymentStep data={loanDetails} onChangeDetails={handleDetailsChange} businessData={businessDetails} onChangeBusiness={handleBusinessChange} errors={errors} />;
      case 2:
        return <VehicleLoanBankingStep data={bankingDetails} onChange={handleBankingChange} errors={errors} hasExistingLoans={loanDetails.hasExistingLoans} />;
      case 3:
        return <VehicleLoanDocumentsStep loanDocuments={loanDocuments} />;
      case 4:
      default:
        return (
          <VehicleLoanReviewStep
            loanDetails={loanDetails}
            businessDetails={loanDetails.employmentType !== "Salaried" ? businessDetails : undefined}
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
        title="Vehicle Loan"
        subtitle={STEPS[currentStepIndex]}
        currentStepIndex={currentStepIndex}
        totalSteps={STEPS.length}
        onBack={wizard.handleBack}
        onSettings={() =>
          Alert.alert(
            "Vehicle Loan Assistance",
            "Need help with your vehicle loan application? Contact support@taxedge.in or your assigned auto-credit manager."
          )
        }
      />
      <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Vehicle Loan Draft?"
        message="You have entered information for your vehicle loan. Save your progress to resume anytime without re-entering details."
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default VehicleLoanScreen;
