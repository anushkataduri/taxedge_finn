import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { useAuthStore } from "../../../../authentication/store/authStore";
import { loansApi } from "../../../services/loansApi";
import { INDIVIDUAL_DOCUMENTS_TEMPLATE } from "../../../mock/loanServices";
import { UniversalDraftModal } from "../../../../../shared/components/UniversalDraftModal";
import { useServiceDraft } from "../../../../../shared/hooks/useServiceDraft";
import {
  LoanDetailsFormData,
  LoanBankingFormData,
  LoanApplicationDraft,
} from "../../../types/loans.types";
import {
  validateLoanDetails,
  validateLoanBanking,
} from "../../../validation/loansSchema";
import { useLoanWizard } from "../../../hooks/useLoanWizard";
import { useLoanDocuments } from "../../../hooks/useLoanDocuments";
import { LoanStepIndicator } from "../../../components/LoanStepIndicator";
import { LoanCustomerCard } from "../../../components/LoanCustomerCard";
import {
  getBottomBarPadding,
  getKeyboardAwareScrollPadding,
  getSafeAreaTopPadding,
} from "../../../styles/loanScreenLayout.styles";
import {
  PersonalLoanFinancialsStep,
  PersonalLoanBankingStep,
  PersonalLoanDocumentsStep,
  PersonalLoanReviewStep,
} from "../../components";
import { styles } from "./PersonalLoanScreen.styles";

const STEPS = ["Financials", "Banking", "Documents", "Review"] as const;
const PERSONAL_LOAN_DOCUMENTS_TEMPLATE = INDIVIDUAL_DOCUMENTS_TEMPLATE.filter((doc) =>
  ["pan", "aadhaar", "bank-statements", "salary-slips", "address-proof", "photograph"].includes(doc.id)
);
/** Statements and salary slips can only be attached as files (no gallery/camera). */
const FILE_ONLY_DOCUMENT_IDS = ["bank-statements", "salary-slips"] as const;

const INITIAL_LOAN_DETAILS: LoanDetailsFormData = {
  loanType: "Personal Loan",
  requiredAmount: "",
  purpose: "",
  preferredTenureMonths: "",
  hasExistingLoans: false,
  existingEmi: "",
  monthlyIncomeOrTurnover: "",
  employmentType: "Salaried",
};

const INITIAL_BANKING_DETAILS: LoanBankingFormData = {
  primaryBankName: "",
  accountNumber: "",
  ifscCode: "",
};

/** Scroll offsets that bring focused Financials fields into view. */
const FIELD_SCROLL_OFFSETS: Record<string, number> = {
  requiredAmount: 80,
  purpose: 220,
  monthlyIncomeOrTurnover: 520,
};

export const PersonalLoanScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => setKeyboardHeight(event.endCoordinates.height)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleInputFocus = (field: string) => {
    scrollViewRef.current?.scrollTo({ y: FIELD_SCROLL_OFFSETS[field] || 0, animated: true });
  };

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const customer = useAuthStore((s) => s.customer);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loanDetails, setLoanDetails] = useState<LoanDetailsFormData>(INITIAL_LOAN_DETAILS);
  const [bankingDetails, setBankingDetails] = useState<LoanBankingFormData>(INITIAL_BANKING_DETAILS);

  const loanDocuments = useLoanDocuments({
    template: PERSONAL_LOAN_DOCUMENTS_TEMPLATE,
    scrollRef: scrollViewRef,
    fileOnlyDocumentIds: FILE_ONLY_DOCUMENT_IDS,
  });
  const { documents } = loanDocuments;

  const wizard = useLoanWizard({
    totalSteps: STEPS.length,
    validateStep: (stepIndex) => validateStep(stepIndex),
    onExitFromFirstStep: () => (isFormDirty() ? openDraftModal() : router.back()),
    onStepChange: scrollToTop,
  });
  const { currentStepIndex } = wizard;

  const isFormDirty = useCallback(() => {
    return Boolean(
      loanDetails.requiredAmount.trim() ||
        loanDetails.purpose.trim() ||
        loanDetails.preferredTenureMonths ||
        loanDetails.hasExistingLoans ||
        loanDetails.existingEmi.trim() ||
        loanDetails.monthlyIncomeOrTurnover.trim() ||
        loanDetails.employmentType !== INITIAL_LOAN_DETAILS.employmentType ||
        bankingDetails.primaryBankName.trim() ||
        bankingDetails.accountNumber.trim() ||
        bankingDetails.ifscCode.trim() ||
        documents.some((document) => document.fileUri) ||
        currentStepIndex > 0
    );
  }, [bankingDetails, currentStepIndex, documents, loanDetails]);

  const {
    showDraftModal,
    openDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
    clearDraft,
  } = useServiceDraft({
    serviceKey: "personal-loan",
    formData: { currentStepIndex, loanDetails, bankingDetails, documents },
    isDirty: isFormDirty,
    onRestore: (saved) => {
      if (saved.loanDetails) setLoanDetails(saved.loanDetails);
      if (saved.bankingDetails) setBankingDetails(saved.bankingDetails);
      if (saved.documents) loanDocuments.setDocuments(saved.documents);
      if (typeof saved.currentStepIndex === "number") {
        wizard.goToStep(saved.currentStepIndex);
      }
    },
    isSubmitted: isSubmitting,
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

  const handleBankingChange = <K extends keyof LoanBankingFormData>(field: K, value: LoanBankingFormData[K]) => {
    setBankingDetails((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  function validateStep(stepIndex: number): boolean {
    if (stepIndex === 0) {
      const errs = validateLoanDetails(loanDetails, { requireExistingEmi: false });
      setErrors(errs);
      return Object.keys(errs).length === 0;
    }

    if (stepIndex === 1) {
      const errs = validateLoanBanking(bankingDetails);
      setErrors(errs);
      return Object.keys(errs).length === 0;
    }

    if (stepIndex === 2) {
      const { isValid, missingDocs } = loanDocuments.validateDocuments();
      if (!isValid) {
        Alert.alert(
          "Mandatory Documents Required",
          `Please upload all required personal documents to continue:\n\n• ${missingDocs.slice(0, 3).join("\n• ")}`
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
        "Please check the authorization consent to lodge your personal loan."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const draft: Partial<LoanApplicationDraft> = {
        loanType: "Personal Loan",
        loanTypeId: "personal-loan",
        customerProfile: customer || undefined,
        loanDetails,
        bankingDetails,
        documents,
      };

      const response = await loansApi.applyLoan(draft);
      markSubmitted();
      await clearDraft();
      const statusRoute: Href = `/service/loan-status?id=${response.applicationId}&loanType=Personal+Loan&amount=${response.amount}`;
      Alert.alert(
        "Personal Loan Submitted",
        `Your application (Ref: ${response.referenceNumber}) has been submitted. Our credit team will verify your dossier shortly.`,
        [{ text: "Track Status", onPress: () => router.replace(statusRoute) }]
      );
    } catch {
      Alert.alert("Submission Error", "Failed to submit application. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderActiveStep = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <>
            <LoanCustomerCard
              profile={customer || undefined}
              labels={{
                infoText:
                  "Personal details are securely fetched from your customer profile table. Manual re-entry is skipped.",
              }}
              verifiedIconColor={BrandColors.PRIMARY_ORANGE}
            />
            <PersonalLoanFinancialsStep
              data={loanDetails}
              onChange={handleDetailsChange}
              errors={errors}
              onInputFocus={handleInputFocus}
            />
          </>
        );
      case 1:
        return (
          <PersonalLoanBankingStep
            data={bankingDetails}
            onChange={handleBankingChange}
            errors={errors}
          />
        );
      case 2:
        return <PersonalLoanDocumentsStep loanDocuments={loanDocuments} />;
      case 3:
      default:
        return (
          <PersonalLoanReviewStep
            loanDetails={loanDetails}
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={wizard.handleBack}>
            <Ionicons name="arrow-back" size={24} color={BrandColors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Personal Loan</Text>
            <Text style={styles.headerSubtitle}>
              Step {wizard.stepNumber} of {STEPS.length} • {STEPS[currentStepIndex]}
            </Text>
          </View>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Step Progress Stepper */}
      <LoanStepIndicator
        variant="numbered"
        steps={STEPS}
        currentStepIndex={currentStepIndex}
        onStepPress={wizard.goToStep}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        {/* Scrollable Step Form */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            getKeyboardAwareScrollPadding(keyboardHeight, insets.bottom),
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
          {renderActiveStep()}
        </ScrollView>

        {/* Sticky Bottom Actions */}
        <View style={[styles.bottomBar, getBottomBarPadding(insets.bottom)]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={wizard.handleBack}
            disabled={isSubmitting}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

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
      </KeyboardAvoidingView>

      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Personal Loan Draft?"
        message="You have entered information for your personal loan. Save your progress to resume anytime."
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default PersonalLoanScreen;
