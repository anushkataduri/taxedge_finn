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
import { PROPERTY_LOAN_DOCUMENTS_TEMPLATE } from "../../../mock/loanServices";
import {
  LoanDetailsFormData,
  LoanApplicantFormData,
  LoanPropertyFormData,
  LoanOwnershipFormData,
  LoanDocumentItem,
  LoanApplicationDraft,
} from "../../../types/loans.types";
import {
  PropertyLoanStepIndicator,
  PropertyLoanFinancialsStep,
  PropertyLoanApplicantStep,
  PropertyLoanPropertyStep,
  PropertyLoanOwnershipStep,
  PropertyLoanDocumentsStep,
  PropertyLoanReviewStep,
} from "../../components";
import { validatePropertyLoanStep } from "../../utils/propertyLoanValidators";
import {
  styles,
  getSafeAreaDynamic,
  getBottomBarDynamic,
} from "./PropertyLoanScreen.styles";

const STEPS = [
  "Loan Requirement",
  "Applicant & Income",
  "Property Details",
  "Ownership",
  "Documents",
  "Review",
];

export const PropertyLoanScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const customer = useAuthStore((s) => s.customer);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Loan Requirement
  const [loanDetails, setLoanDetails] = useState<LoanDetailsFormData>({
    loanType: "Property Loan",
    requiredAmount: "",
    purpose: "",
    preferredTenureMonths: "",
    hasExistingLoans: undefined,
    existingEmi: "",
    monthlyIncomeOrTurnover: "",
    employmentType: undefined,
  });

  // Step 2: Applicant & Income Details
  const [applicantDetails, setApplicantDetails] = useState<LoanApplicantFormData>({
    fullName: "",
    pan: "",
    mobile: "",
    dob: "",
    currentAddress: "",
    gender: "",
    maritalStatus: "",
    residenceType: "",
    yearsAtCurrentAddress: "",
    employerCategory: "",
    employerName: "",
    totalWorkExperience: "",
    yearsInCurrentJob: "",
    annualIncome: "",
    hasExistingLoans: null,
  });

  // Step 3: Property Details
  const [propertyDetails, setPropertyDetails] = useState<LoanPropertyFormData>({
    pincode: "",
    city: "",
    district: "",
    state: "",
    propertyAddress: "",
    landmark: "",
    propertyType: "",
    propertySubType: "",
    constructionStatus: "",
    currentUsage: "",
    areaType: "",
    area: "",
    propertyAge: "",
    approvingAuthority: "",
    estimatedMarketValue: "",
  });

  // Step 4: Ownership Details
  const [ownershipDetails, setOwnershipDetails] = useState<LoanOwnershipFormData>({
    ownershipType: "",
    coOwnerFullName: "",
    coOwnerRelationship: "",
    coOwnerPan: "",
    coOwnerMobile: "",
    currentLender: "",
    existingLoanType: "",
    outstandingLoanAmount: "",
    isConfirmationChecked: false,
  });

  // Documents
  const [documents, setDocuments] = useState<LoanDocumentItem[]>(() =>
    JSON.parse(JSON.stringify(PROPERTY_LOAN_DOCUMENTS_TEMPLATE))
  );

  const handleDetailsChange = (
    field: keyof LoanDetailsFormData,
    value: string | number | boolean | null
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

  const handleApplicantChange = (
    field: keyof LoanApplicantFormData,
    value: string | boolean | null
  ) => {
    setApplicantDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePropertyChange = (
    field: keyof LoanPropertyFormData,
    value: string
  ) => {
    setPropertyDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleOwnershipChange = (
    field: keyof LoanOwnershipFormData,
    value: string | boolean
  ) => {
    setOwnershipDetails((prev) => ({ ...prev, [field]: value }));
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

  // Step Validation Logic using extracted validator
  const validateCurrentStep = (): boolean => {
    const result = validatePropertyLoanStep({
      currentStepIndex,
      loanDetails,
      applicantDetails,
      propertyDetails,
      ownershipDetails,
      documents,
    });

    if (!result.isValid) {
      setErrors(result.errors);
      if (result.alertTitle && result.alertMessage) {
        Alert.alert(result.alertTitle, result.alertMessage);
      }
      return false;
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
    setIsSubmitting(true);
    try {
      const draft: Partial<LoanApplicationDraft> = {
        loanType: "Property Loan",
        loanTypeId: "property-loan",
        customerProfile: customer || undefined,
        loanDetails,
        applicantDetails,
        propertyDetails,
        ownershipDetails,
        documents,
      };

      const response = await loansApi.applyLoan(draft);
      Alert.alert(
        "Property Loan Submitted",
        `Your application (Ref: ${response.referenceNumber}) has been submitted. Our legal and technical valuation team will contact you shortly.`,
        [
          {
            text: "Track Status",
            onPress: () => {
              router.replace(
                `/service/loan-status?id=${response.applicationId}&loanType=Property+Loan` as any
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

  const [isConsentChecked, setIsConsentChecked] = useState(true);

  const renderActiveStep = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <PropertyLoanFinancialsStep
            data={loanDetails}
            onChange={handleDetailsChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <PropertyLoanApplicantStep
            data={applicantDetails}
            onChange={handleApplicantChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <PropertyLoanPropertyStep
            data={propertyDetails}
            onChange={handlePropertyChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <PropertyLoanOwnershipStep
            data={ownershipDetails}
            onChange={handleOwnershipChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <PropertyLoanDocumentsStep
            documents={documents}
            onDocumentUploaded={handleDocumentUploaded}
          />
        );
      case 5:
      default:
        return (
          <PropertyLoanReviewStep
            loanDetails={loanDetails}
            applicantDetails={applicantDetails}
            propertyDetails={propertyDetails}
            ownershipDetails={ownershipDetails}
            documents={documents}
            isConsentChecked={isConsentChecked}
            onConsentToggle={(checked) => setIsConsentChecked(checked)}
            onGoToStep={(stepIdx) => setCurrentStepIndex(stepIdx)}
          />
        );
    }
  };

  return (
    <View style={[styles.safeArea, getSafeAreaDynamic(insets.top)]}>
      {/* Top Header */}
      <PropertyLoanStepIndicator
        currentStepIndex={currentStepIndex}
        totalSteps={STEPS.length}
        stepTitle={STEPS[currentStepIndex]}
        onBack={handleBack}
      />

      {/* Step Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderActiveStep()}
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, getBottomBarDynamic(insets.bottom)]}>
        <TouchableOpacity
          style={[styles.continueBtn, isSubmitting && styles.continueBtnDisabled]}
          onPress={handleNext}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color={BrandColors.WHITE} size="small" />
          ) : (
            <>
              <Text style={styles.continueBtnText}>
                {currentStepIndex === STEPS.length - 1
                  ? "Submit Application"
                  : "Continue"}
              </Text>
              <Ionicons
                name={
                  currentStepIndex === STEPS.length - 1
                    ? "shield-checkmark"
                    : "arrow-forward"
                }
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

export default PropertyLoanScreen;
