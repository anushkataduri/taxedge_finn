import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
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
  LoanDocumentItem,
  LoanApplicationDraft,
} from "../../../types/loans.types";
import {
  validateLoanDetails,
  validateLoanBusiness,
  validateLoanBanking,
  validateLoanDocuments,
} from "../../../validation/loansSchema";
import {
  ProjectFinanceStepIndicator,
  ProjectFinanceCustomerCard,
  ProjectFinanceFinancialsStep,
  ProjectFinanceBusinessStep,
  ProjectFinanceBankingStep,
  ProjectFinanceDocumentsStep,
  ProjectFinanceReviewStep,
} from "../../components";
import { styles } from "./ProjectFinanceScreen.styles";

const STEPS = ["Financials", "Project SPV", "Banking", "Documents", "Review"];

export const ProjectFinanceScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const customer = useAuthStore((s) => s.customer);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Financials
  const [loanDetails, setLoanDetails] = useState<LoanDetailsFormData>({
    loanType: "Project Finance",
    requiredAmount: "50000000",
    purpose: "Greenfield Manufacturing Plant",
    preferredTenureMonths: "84",
    hasExistingLoans: false,
    existingEmi: "",
    monthlyIncomeOrTurnover: "2000000",
    employmentType: "Business Owner",
  });

  // Step 2: Project entity details
  const [businessDetails, setBusinessDetails] = useState<LoanBusinessFormData>({
    businessName: "",
    gstin: "",
    udyamRegistration: "",
    businessVintageYears: "5",
    annualTurnover: "25000000",
    netProfit: "3500000",
  });

  // Step 3: Banking
  const [bankingDetails, setBankingDetails] = useState<LoanBankingFormData>({
    primaryBankName: "",
    accountNumber: "",
    ifscCode: "",
    existingLenderName: "",
    existingLoanOutstanding: "",
    itrFilingStatus: "Filed",
    itrAckNumber: "",
    grossTotalIncome: "",
  });

  // Step 4: Documents
  const [documents, setDocuments] = useState<LoanDocumentItem[]>(() =>
    JSON.parse(JSON.stringify(BUSINESS_DOCUMENTS_TEMPLATE))
  );

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

  const handleBusinessChange = (
    field: keyof LoanBusinessFormData,
    value: any
  ) => {
    setBusinessDetails((prev) => ({ ...prev, [field]: value }));
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
    value: string
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

  const validateCurrentStep = (): boolean => {
    if (currentStepIndex === 0) {
      const errs = validateLoanDetails(loanDetails);
      setErrors(errs);
      return Object.keys(errs).length === 0;
    }

    if (currentStepIndex === 1) {
      const errs = validateLoanBusiness(businessDetails);
      setErrors(errs);
      return Object.keys(errs).length === 0;
    }

    if (currentStepIndex === 2) {
      const errs = validateLoanBanking(bankingDetails);
      setErrors(errs);
      return Object.keys(errs).length === 0;
    }

    if (currentStepIndex === 3) {
      const { isValid, missingDocs } = validateLoanDocuments(documents);
      if (!isValid) {
        Alert.alert(
          "Mandatory Documents Required",
          `Please upload all required project reports and financial audits to continue:\n\n• ${missingDocs.slice(0, 3).join("\n• ")}`
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
    } else {
      router.back();
    }
  };

  const handleSubmitApplication = async () => {
    if (!isConsentChecked) {
      Alert.alert(
        "Consent Required",
        "Please check the authorization declaration to submit your Project Finance application."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const draft: Partial<LoanApplicationDraft> = {
        loanType: "Project Finance",
        loanTypeId: "project-finance",
        customerProfile: customer || undefined,
        loanDetails,
        businessDetails,
        bankingDetails,
        documents,
      };

      const response = await loansApi.applyLoan(draft);
      Alert.alert(
        "Project Finance Dossier Lodged",
        `Your application (Ref: ${response.referenceNumber}) has been submitted. Our infrastructure debt syndication desk will initiate TEFR evaluation shortly.`,
        [
          {
            text: "Track Status",
            onPress: () => {
              router.replace(
                `/service/loan-status?id=${response.applicationId}&loanType=Project+Finance` as any
              );
            },
          },
        ]
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
          <>
            <ProjectFinanceCustomerCard profile={customer || undefined} />
            <ProjectFinanceFinancialsStep
              data={loanDetails}
              onChange={handleDetailsChange}
              errors={errors}
            />
          </>
        );
      case 1:
        return (
          <ProjectFinanceBusinessStep
            data={businessDetails}
            onChange={handleBusinessChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <ProjectFinanceBankingStep
            data={bankingDetails}
            onChange={handleBankingChange}
            errors={errors}
            hasExistingLoans={loanDetails.hasExistingLoans}
          />
        );
      case 3:
        return (
          <ProjectFinanceDocumentsStep
            documents={documents}
            onDocumentUploaded={handleDocumentUploaded}
          />
        );
      case 4:
      default:
        return (
          <ProjectFinanceReviewStep
            loanDetails={loanDetails}
            businessDetails={businessDetails}
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
            <Text style={styles.headerTitle}>Project Finance</Text>
            <Text style={styles.headerSubtitle}>
              Step {currentStepIndex + 1} of {STEPS.length} • {STEPS[currentStepIndex]}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveDraftButton}
          onPress={() => Alert.alert("Draft Saved", "Project finance draft saved successfully.")}
        >
          <Text style={styles.saveDraftText}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      {/* Step Progress Stepper */}
      <ProjectFinanceStepIndicator
        steps={STEPS}
        currentStepIndex={currentStepIndex}
        onStepPress={(idx) => {
          if (idx <= currentStepIndex) {
            setCurrentStepIndex(idx);
          }
        }}
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
            {currentStepIndex === 0 ? "Cancel" : "Back"}
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
    </View>
  );
};

export default ProjectFinanceScreen;
