import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "../../../../authentication/store/authStore";
import { loansApi } from "../../../services/loansApi";
import { VEHICLE_LOAN_DOCUMENTS_TEMPLATE } from "../../constants/vehicleLoanDocuments";
import { vehicleLoanDraftService, VehicleLoanDraftData } from "../../services/vehicleLoanDraftService";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { LoanBusinessFormData, LoanBankingFormData, LoanDocumentItem, LoanApplicationDraft } from "../../../types/loans.types";
import { VehicleLoanDetailsFormData } from "../../types/vehicleLoan.types";
import { validateLoanDocuments } from "../../../validation/loansSchema";
import {
  VehicleLoanStepIndicator,
  VehicleLoanFinancialsStep,
  VehicleLoanEmploymentStep,
  VehicleLoanBankingStep,
  VehicleLoanDocumentsStep,
  VehicleLoanReviewStep,
} from "../../components";
import { styles, getSafeAreaStyle, getBottomBarStyle } from "./VehicleLoanScreen.styles";

// ==========================================
// CONSTANTS & DEFAULT STATES
// ==========================================
const STEPS = ["Vehicle & Loan Requirements", "Employment & Income", "Banking & ITR", "Document Dossier", "Review & Lodgement"];

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

export const VehicleLoanScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const customer = useAuthStore((s) => s.customer);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loanDetails, setLoanDetails] = useState<VehicleLoanDetailsFormData>(INITIAL_LOAN_DETAILS);
  const [businessDetails, setBusinessDetails] = useState<LoanBusinessFormData>(INITIAL_BUSINESS_DETAILS);
  const [bankingDetails, setBankingDetails] = useState<LoanBankingFormData>(INITIAL_BANKING_DETAILS);
  const [documents, setDocuments] = useState<LoanDocumentItem[]>(() =>
    JSON.parse(JSON.stringify(VEHICLE_LOAN_DOCUMENTS_TEMPLATE))
  );

  useEffect(() => {
    vehicleLoanDraftService.loadDraft().then((savedDraft: VehicleLoanDraftData | null) => {
      if (savedDraft) {
        setLoanDetails(savedDraft.loanDetails);
        setBusinessDetails(savedDraft.businessDetails);
        setBankingDetails(savedDraft.bankingDetails);
        setDocuments(savedDraft.documents);
        setCurrentStepIndex(savedDraft.currentStepIndex || 0);
      }
    });
  }, []);

  const resetAllFields = useCallback(() => {
    setLoanDetails(INITIAL_LOAN_DETAILS);
    setBusinessDetails(INITIAL_BUSINESS_DETAILS);
    setBankingDetails(INITIAL_BANKING_DETAILS);
    setDocuments(JSON.parse(JSON.stringify(VEHICLE_LOAN_DOCUMENTS_TEMPLATE)));
    setCurrentStepIndex(0);
    setErrors({});
  }, []);

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
      vehicleLoanDraftService.saveDraft({
        currentStepIndex, loanDetails, businessDetails, bankingDetails, documents, savedAt: new Date().toISOString(),
      });
    },
    onDiscardDraft: () => {
      vehicleLoanDraftService.clearDraft();
      resetAllFields();
    },
    isSubmitted: () => currentStepIndex >= 4 && isSubmitting,
  });

  // ==========================================
  // FIELD HANDLERS & ERROR CLEARER
  // ==========================================
  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleDetailsChange = (field: keyof VehicleLoanDetailsFormData, value: any) => {
    setLoanDetails((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field as string);
  };

  const handleBusinessChange = (field: keyof LoanBusinessFormData, value: string) => {
    setBusinessDetails((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field as string);
  };

  const handleBankingChange = (field: keyof LoanBankingFormData, value: string) => {
    setBankingDetails((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field as string);
  };

  const handleDocumentUploaded = (docId: string, fileUri: string, fileName: string, fileSize: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, fileUri, fileName, fileSize, uploadedAt: new Date().toISOString() } : d)));
  };

  const handleDocumentDeleted = (docId: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, fileUri: undefined, fileName: undefined, fileSize: undefined, uploadedAt: undefined } : d)));
  };

  // ==========================================
  // STEP VALIDATION LOGIC
  // ==========================================
  const validateVehicleDetails = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const amountNum = Number(loanDetails.requiredAmount);
    if (!loanDetails.requiredAmount || isNaN(amountNum) || amountNum < 10000) {
      errs.requiredAmount = "Enter a valid required loan amount (minimum ₹10,000)";
    }
    if (!loanDetails.purpose?.trim()) {
      errs.purpose = "Please select a vehicle category / purpose";
    } else if (loanDetails.purpose === "Others" && !loanDetails.customPurpose?.trim()) {
      errs.customPurpose = "Please specify custom vehicle requirement";
    }
    if (!loanDetails.preferredTenureMonths) errs.preferredTenureMonths = "Please select a repayment tenure";
    if (!loanDetails.vehicleCondition) errs.vehicleCondition = "Please select vehicle condition (New or Pre-Owned)";
    if (!loanDetails.vehicleMakeModel?.trim()) errs.vehicleMakeModel = "Please enter vehicle make and model";
    const priceNum = Number(loanDetails.onRoadPrice);
    if (!loanDetails.onRoadPrice || isNaN(priceNum) || priceNum <= 0) {
      errs.onRoadPrice = "Please enter estimated on-road price / valuation";
    }
    return errs;
  };

  const validateEmploymentDetails = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!loanDetails.employmentType) errs.employmentType = "Please select an employment category";
    const incomeStr = loanDetails.monthlyIncomeOrTurnover?.trim();
    const incomeNum = Number(incomeStr);
    if (!incomeStr || (!isNaN(incomeNum) && incomeNum <= 0)) {
      errs.monthlyIncomeOrTurnover = "Please select or enter monthly in-hand net income";
    }
    if (loanDetails.hasExistingLoans) {
      const emiNum = Number(loanDetails.existingEmi);
      if (!loanDetails.existingEmi || isNaN(emiNum) || emiNum <= 0) {
        errs.existingEmi = "Please specify ongoing monthly EMI obligations";
      }
    }
    if (loanDetails.employmentType === "Business Owner" && !businessDetails.businessName?.trim()) {
      errs.businessName = "Business name is required for business owners";
    }
    return errs;
  };

  const validateBankingDetails = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!bankingDetails.primaryBankName?.trim()) errs.primaryBankName = "Primary operating bank name is required";
    if (!bankingDetails.accountNumber || bankingDetails.accountNumber.trim().length < 6) {
      errs.accountNumber = "Valid bank account number is required (min 6 digits)";
    }
    if (!bankingDetails.ifscCode || bankingDetails.ifscCode.trim().length < 11) {
      errs.ifscCode = "Valid 11-digit bank IFSC code is required";
    }
    if (!bankingDetails.itrFilingStatus) errs.itrFilingStatus = "Please select an ITR filing status";
    return errs;
  };

  const validateCurrentStep = (): boolean => {
    if (currentStepIndex === 0) {
      const errs = validateVehicleDetails();
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        Alert.alert("Required Details Missing", "Please enter loan amount, vehicle category, tenure, and vehicle details to continue.");
        return false;
      }
      return true;
    }
    if (currentStepIndex === 1) {
      const errs = validateEmploymentDetails();
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        Alert.alert("Incomplete Profile", "Please select an employment category and enter your monthly net income to continue.");
        return false;
      }
      return true;
    }
    if (currentStepIndex === 2) {
      const errs = validateBankingDetails();
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        Alert.alert("Banking Details Missing", "Please enter your bank name, account number, IFSC code, and select ITR status to continue.");
        return false;
      }
      return true;
    }
    if (currentStepIndex === 3) {
      const { isValid, missingDocs } = validateLoanDocuments(documents);
      if (!isValid) {
        Alert.alert("Mandatory Documents Required", `Please upload all required vehicle financing documents to continue:\n\n• ${missingDocs.slice(0, 3).join("\n• ")}`);
        return false;
      }
      return true;
    }
    return true;
  };

  // ==========================================
  // NAVIGATION & SUBMISSION LOGIC
  // ==========================================
  const handleGoToStep = (stepIdx: number) => {
    setCurrentStepIndex(stepIdx);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStepIndex < STEPS.length - 1) {
      handleGoToStep(currentStepIndex + 1);
    } else {
      handleSubmitApplication();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      handleGoToStep(currentStepIndex - 1);
    } else if (isFormDirty()) {
      openDraftModal();
    } else {
      router.back();
    }
  };

  const buildApplicationPayload = (): Partial<LoanApplicationDraft> => ({
    loanType: "Vehicle Loan",
    loanTypeId: "vehicle-loan",
    customerProfile: customer || undefined,
    loanDetails: loanDetails as any,
    businessDetails: loanDetails.employmentType !== "Salaried" ? businessDetails : undefined,
    bankingDetails,
    documents,
  });

  const handleSubmitApplication = async () => {
    if (!isConsentChecked) {
      Alert.alert("Consent Required", "Please check the authorization declaration to lodge your vehicle loan.");
      return;
    }
    setIsSubmitting(true);
    try {
      const draft = buildApplicationPayload();
      const response = await loansApi.applyLoan(draft);
      markSubmitted();
      await vehicleLoanDraftService.clearDraft();
      router.replace(`/service/loan-status?id=${response.applicationId}&loanType=Vehicle+Loan&isSuccess=true` as any);
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
        return <VehicleLoanDocumentsStep documents={documents} onDocumentUploaded={handleDocumentUploaded} onDocumentDeleted={handleDocumentDeleted} />;
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
            onGoToStep={handleGoToStep}
          />
        );
    }
  };

  const isFinalStep = currentStepIndex === STEPS.length - 1;

  return (
    <View style={getSafeAreaStyle(insets.top)}>
      <VehicleLoanStepIndicator
        currentStepIndex={currentStepIndex}
        totalSteps={STEPS.length}
        stepTitle={STEPS[currentStepIndex]}
        onBack={handleBack}
        onSettings={() => Alert.alert("Vehicle Loan Assistance", "Need help with your vehicle loan application? Contact support@taxedge.in or your assigned auto-credit manager.")}
      />
      <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderActiveStep()}
      </ScrollView>
      <View style={getBottomBarStyle(insets.bottom)}>
        <TouchableOpacity style={[styles.nextButton, isSubmitting && styles.nextButtonDisabled]} onPress={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>{isFinalStep ? "Submit Application" : "Continue"}</Text>
              <Ionicons name={isFinalStep ? "shield-checkmark" : "arrow-forward"} size={18} color="#FFFFFF" />
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
