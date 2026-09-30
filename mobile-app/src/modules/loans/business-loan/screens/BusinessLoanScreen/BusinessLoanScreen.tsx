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
  BusinessLoanStepIndicator,
  BusinessLoanFinancialsStep,
  BusinessLoanBusinessStep,
  BusinessLoanBankingStep,
  BusinessLoanDocumentsStep,
  BusinessLoanReviewStep,
} from "../../components";
import { styles } from "./BusinessLoanScreen.styles";

const STEPS = ["Loan & Applicant", "Business", "Banking", "Documents", "Review"];

export const BusinessLoanScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const customer = useAuthStore((s) => s.customer);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
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

  // Step 4: Documents
  const [documents, setDocuments] = useState<LoanDocumentItem[]>(() =>
    JSON.parse(JSON.stringify(BUSINESS_DOCUMENTS_TEMPLATE))
  );

  const handleDetailsChange = <K extends keyof LoanDetailsFormData>(
    field: K,
    value: LoanDetailsFormData[K]
  ) => {
    setLoanDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBusinessChange = <K extends keyof LoanBusinessFormData>(
    field: K,
    value: LoanBusinessFormData[K]
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
      prev.map((d) => {
        const targetId = docId.replace(/^doc-/, "");
        const itemCleanId = d.id.replace(/^doc-/, "");
        if (d.id === docId || itemCleanId === targetId) {
          return {
            ...d,
            fileUri,
            fileName,
            fileSize,
            uploadedAt: new Date().toISOString(),
          };
        }
        return d;
      })
    );
  };

  const handleDocumentDeleted = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        const targetId = docId.replace(/^doc-/, "");
        const itemCleanId = d.id.replace(/^doc-/, "");
        if (d.id === docId || itemCleanId === targetId) {
          const nextDoc = { ...d };
          delete nextDoc.fileUri;
          delete nextDoc.fileName;
          delete nextDoc.fileSize;
          delete nextDoc.uploadedAt;
          return nextDoc;
        }
        return d;
      })
    );
  };

  const validateCurrentStep = (): boolean => {
    if (currentStepIndex === 0) {
      const step1Errors = validateLoanDetails(loanDetails, { requireExistingEmi: false });
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        Alert.alert(
          "Required Fields Missing",
          "Please fill in all required fields in Step 1 before proceeding."
        );
        return false;
      }
    } else if (currentStepIndex === 1) {
      const step2Errors = validateLoanBusiness(businessDetails);
      if (Object.keys(step2Errors).length > 0) {
        setErrors(step2Errors);
        Alert.alert(
          "Required Fields Missing",
          "Please fill in all required fields in Step 2 before proceeding."
        );
        return false;
      }
    } else if (currentStepIndex === 2) {
      const step3Errors = validateLoanBanking(bankingDetails);
      if (Object.keys(step3Errors).length > 0) {
        setErrors(step3Errors);
        Alert.alert(
          "Required Fields Missing",
          "Please fill in all required banking details (Bank Name, Account Number, IFSC) in Step 3 before proceeding."
        );
        return false;
      }
    } else if (currentStepIndex === 3) {
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
              const statusUrl = `/service/loan-status?id=${encodeURIComponent(
                response.applicationId
              )}&loanType=${encodeURIComponent("Business Loan")}`;
              router.replace(statusUrl as any);
            },
          },
        ]
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to lodge application. Please check your network connection and try again.";
      Alert.alert("Submission Error", errorMessage);
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
        return (
          <BusinessLoanDocumentsStep
            documents={documents}
            onDocumentUploaded={handleDocumentUploaded}
            onDocumentDeleted={handleDocumentDeleted}
          />
        );
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
      {/* Header with Step X of 5 & Orange Linear Progress Bar */}
      <BusinessLoanStepIndicator
        currentStepIndex={currentStepIndex}
        totalSteps={STEPS.length}
        stepTitle={STEPS[currentStepIndex]}
        onBack={handleBack}
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
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
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

export default BusinessLoanScreen;
