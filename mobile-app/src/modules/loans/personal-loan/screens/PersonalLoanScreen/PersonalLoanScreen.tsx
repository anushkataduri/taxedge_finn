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
import { useRouter } from "expo-router";
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
  LoanDocumentItem,
  LoanApplicationDraft,
} from "../../../types/loans.types";
import {
  validateLoanDetails,
  validateLoanBanking,
  validateLoanDocuments,
} from "../../../validation/loansSchema";
import {
  PersonalLoanStepIndicator,
  PersonalLoanCustomerCard,
  PersonalLoanFinancialsStep,
  PersonalLoanBankingStep,
  PersonalLoanDocumentsStep,
  PersonalLoanReviewStep,
} from "../../components";
import { styles } from "./PersonalLoanScreen.styles";

const STEPS = ["Financials", "Banking", "Documents", "Review"];
const PERSONAL_LOAN_DOCUMENTS_TEMPLATE = INDIVIDUAL_DOCUMENTS_TEMPLATE.filter((doc) =>
  ["pan", "aadhaar", "bank-statements", "salary-slips", "address-proof", "photograph"].includes(doc.id)
);

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
    const offsets: Record<string, number> = {
      requiredAmount: 80,
      purpose: 220,
      monthlyIncomeOrTurnover: 520,
    };
    scrollViewRef.current?.scrollTo({
      y: offsets[field] || 0,
      animated: true,
    });
  };

  const customer = useAuthStore((s) => s.customer);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [loanDetails, setLoanDetails] = useState<LoanDetailsFormData>(INITIAL_LOAN_DETAILS);
  const [bankingDetails, setBankingDetails] = useState<LoanBankingFormData>(INITIAL_BANKING_DETAILS);

  const [documents, setDocuments] = useState<LoanDocumentItem[]>(() =>
    JSON.parse(JSON.stringify(PERSONAL_LOAN_DOCUMENTS_TEMPLATE))
  );

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
      if (saved.documents) setDocuments(saved.documents);
      if (typeof saved.currentStepIndex === "number") {
        setCurrentStepIndex(saved.currentStepIndex);
      }
    },
    isSubmitted: isSubmitting,
  });

  const handleDetailsChange = (field: keyof LoanDetailsFormData, value: any) => {
    setLoanDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBankingChange = (
    field: keyof LoanBankingFormData,
    value: any
  ) => {
    setBankingDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleDocumentUploaded = (
    docId: string,
    fileUri: string,
    fileName: string,
    fileSize: string
  ) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              fileUri,
              fileName,
              fileSize,
              uploadedAt: new Date().toISOString(),
            }
          : d
      )
    );
  };

  const handleDocumentRemoved = (docId: string) => {
    setDocuments((prev) =>
      prev.map((document) =>
        document.id === docId
          ? {
              ...document,
              fileUri: undefined,
              fileName: undefined,
              fileSize: undefined,
              uploadedAt: undefined,
            }
          : document
      )
    );
  };

  const validateCurrentStep = (): boolean => {
    if (currentStepIndex === 0) {
      const errs = validateLoanDetails(loanDetails, { requireExistingEmi: false });
      setErrors(errs);
      return Object.keys(errs).length === 0;
    }

    if (currentStepIndex === 1) {
      const errs = validateLoanBanking(bankingDetails);
      setErrors(errs);
      return Object.keys(errs).length === 0;
    }

    if (currentStepIndex === 2) {
      const { isValid, missingDocs } = validateLoanDocuments(documents);
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
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      handleSubmitApplication();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else if (isFormDirty()) {
      openDraftModal();
    } else {
      router.back();
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
      Alert.alert(
        "Personal Loan Submitted",
        `Your application (Ref: ${response.referenceNumber}) has been submitted. Our credit team will verify your dossier shortly.`,
        [
          {
            text: "Track Status",
            onPress: () => {
              router.replace(
                `/service/loan-status?id=${response.applicationId}&loanType=Personal+Loan&amount=${response.amount}` as any
              );
            },
          },
        ]
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
            <PersonalLoanCustomerCard profile={customer || undefined} />
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
        return (
          <PersonalLoanDocumentsStep
            documents={documents}
            onDocumentUploaded={handleDocumentUploaded}
            onDocumentRemoved={handleDocumentRemoved}
            scrollRef={scrollViewRef}
          />
        );
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
            onGoToStep={(stepIdx) => {
              setCurrentStepIndex(stepIdx);
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }}
          />
        );
    }
  };

  const isFinalStep = currentStepIndex === STEPS.length - 1;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Personal Loan</Text>
            <Text style={styles.headerSubtitle}>
              Step {currentStepIndex + 1} of {STEPS.length} • {STEPS[currentStepIndex]}
            </Text>
          </View>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Step Progress Stepper */}
      <PersonalLoanStepIndicator
        steps={STEPS}
        currentStepIndex={currentStepIndex}
        onStepPress={(idx) => {
          if (idx <= currentStepIndex) {
            setCurrentStepIndex(idx);
          }
        }}
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
            { paddingBottom: Math.max(keyboardHeight + 96, insets.bottom + 40) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
          {renderActiveStep()}
        </ScrollView>

        {/* Sticky Bottom Actions */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          disabled={isSubmitting}
        >
          <Text style={styles.backButtonText}>
            Back
          </Text>
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
                {isFinalStep ? "Submit Application" : "Continue"}
              </Text>
              <Ionicons
                name={isFinalStep ? "shield-checkmark" : "arrow-forward"}
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
