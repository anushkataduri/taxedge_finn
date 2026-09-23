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
  LoanApplicantFormData,
  LoanPropertyFormData,
  LoanOwnershipFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanDocumentItem,
  LoanApplicationDraft,
} from "../../../types/loans.types";
import {
  PropertyLoanCustomerCard,
  PropertyLoanFinancialsStep,
  PropertyLoanApplicantStep,
  PropertyLoanPropertyStep,
  PropertyLoanOwnershipStep,
  PropertyLoanBusinessStep,
  PropertyLoanBankingStep,
  PropertyLoanDocumentsStep,
  PropertyLoanReviewStep,
} from "../../components";
import { styles } from "./PropertyLoanScreen.styles";

const STEPS = [
  "Loan Requirement",
  "Applicant & Income",
  "Property Details",
  "Ownership",
  "Documents",
  "Review",
];

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;

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
    hasExistingLoans: undefined as any,
    existingEmi: "",
    monthlyIncomeOrTurnover: "",
    employmentType: "" as any,
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

  // Business Details (Optional / Backup)
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
  });

  // Banking Details (Backup)
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

  // Documents
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

  const handleApplicantChange = (field: keyof LoanApplicantFormData, value: any) => {
    setApplicantDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePropertyChange = (field: keyof LoanPropertyFormData, value: any) => {
    setPropertyDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleOwnershipChange = (field: keyof LoanOwnershipFormData, value: any) => {
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

  // Step Validation Logic for Steps 1, 2, 3, 4
  const validateCurrentStep = (): boolean => {
    const errs: Record<string, string> = {};

    // 1st Page Validation (Step 1: Loan Requirement)
    if (currentStepIndex === 0) {
      if (!loanDetails.purpose || loanDetails.purpose.trim() === "") {
        errs.purpose = "Please select a loan purpose";
      }

      const rawAmount = (loanDetails.requiredAmount || "").replace(/[^0-9]/g, "");
      const amountNum = Number(rawAmount);
      if (!loanDetails.requiredAmount || isNaN(amountNum) || amountNum <= 0) {
        errs.requiredAmount = "Enter valid required loan amount";
      } else if (amountNum < 10000) {
        errs.requiredAmount = "Minimum loan amount is ₹10,000";
      }

      if (!loanDetails.preferredTenureMonths || loanDetails.preferredTenureMonths.trim() === "") {
        errs.preferredTenureMonths = "Please select preferred tenure";
      }

      if (!loanDetails.employmentType) {
        errs.employmentType = "Please select applicant type";
      }

      if (loanDetails.hasExistingLoans === undefined || loanDetails.hasExistingLoans === null) {
        errs.hasExistingLoans = "Please select whether you have existing customer status";
      }

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        Alert.alert(
          "Required Fields Missing",
          "Please fill in all required fields on Step 1 before proceeding."
        );
        return false;
      }
    }

    // 2nd Page Validation (Step 2: Applicant & Income)
    else if (currentStepIndex === 1) {
      if (!applicantDetails.fullName || applicantDetails.fullName.trim() === "") {
        errs.fullName = "Full name is required";
      }

      const panClean = (applicantDetails.pan || "").trim().toUpperCase();
      if (!panClean || !PAN_REGEX.test(panClean)) {
        errs.pan = "Enter a valid 10-character PAN (e.g. ABCDE1234F)";
      }

      const mobileClean = (applicantDetails.mobile || "").trim();
      if (!mobileClean || !MOBILE_REGEX.test(mobileClean)) {
        errs.mobile = "Enter a valid 10-digit mobile number";
      }

      if (!applicantDetails.dob || applicantDetails.dob.trim() === "") {
        errs.dob = "Date of birth is required";
      }

      if (!applicantDetails.currentAddress || applicantDetails.currentAddress.trim() === "") {
        errs.currentAddress = "Current address is required";
      }

      if (!applicantDetails.gender || applicantDetails.gender.trim() === "") {
        errs.gender = "Please select gender";
      }

      if (!applicantDetails.maritalStatus || applicantDetails.maritalStatus.trim() === "") {
        errs.maritalStatus = "Please select marital status";
      }

      if (!applicantDetails.residenceType || applicantDetails.residenceType.trim() === "") {
        errs.residenceType = "Please select residence type";
      }

      if (!applicantDetails.yearsAtCurrentAddress || applicantDetails.yearsAtCurrentAddress.trim() === "") {
        errs.yearsAtCurrentAddress = "Please select years at current address";
      }

      if (!applicantDetails.employerCategory || applicantDetails.employerCategory.trim() === "") {
        errs.employerCategory = "Please select employer category";
      }

      if (!applicantDetails.employerName || applicantDetails.employerName.trim() === "") {
        errs.employerName = "Employer name is required";
      }

      if (!applicantDetails.totalWorkExperience || applicantDetails.totalWorkExperience.trim() === "") {
        errs.totalWorkExperience = "Please select total work experience";
      }

      if (!applicantDetails.yearsInCurrentJob || applicantDetails.yearsInCurrentJob.trim() === "") {
        errs.yearsInCurrentJob = "Please select years in current job";
      }

      const incomeNum = Number((applicantDetails.annualIncome || "").replace(/[^0-9]/g, ""));
      if (!applicantDetails.annualIncome || isNaN(incomeNum) || incomeNum <= 0) {
        errs.annualIncome = "Enter valid annual income";
      }

      if (applicantDetails.hasExistingLoans === undefined || applicantDetails.hasExistingLoans === null) {
        errs.hasExistingLoans = "Please select whether you have existing loans";
      }

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        Alert.alert(
          "Required Fields Missing",
          "Please fill in all required applicant and income details on Step 2 before proceeding."
        );
        return false;
      }
    }

    // 3rd Page Validation (Step 3: Property Details)
    else if (currentStepIndex === 2) {
      const pinClean = (propertyDetails.pincode || "").trim();
      if (!pinClean || !/^\d{6}$/.test(pinClean)) {
        errs.pincode = "Enter a valid 6-digit PIN code";
      }

      if (!propertyDetails.city || propertyDetails.city.trim() === "") {
        errs.city = "City is required";
      }

      if (!propertyDetails.district || propertyDetails.district.trim() === "") {
        errs.district = "District is required";
      }

      if (!propertyDetails.state || propertyDetails.state.trim() === "") {
        errs.state = "Please select state";
      }

      if (!propertyDetails.propertyAddress || propertyDetails.propertyAddress.trim() === "") {
        errs.propertyAddress = "Property address is required";
      }

      if (!propertyDetails.propertyType || propertyDetails.propertyType.trim() === "") {
        errs.propertyType = "Please select property type";
      }

      if (!propertyDetails.propertySubType || propertyDetails.propertySubType.trim() === "") {
        errs.propertySubType = "Please select property sub-type";
      }

      if (!propertyDetails.constructionStatus || propertyDetails.constructionStatus.trim() === "") {
        errs.constructionStatus = "Please select construction status";
      }

      if (!propertyDetails.currentUsage || propertyDetails.currentUsage.trim() === "") {
        errs.currentUsage = "Please select current usage";
      }

      if (!propertyDetails.areaType || propertyDetails.areaType.trim() === "") {
        errs.areaType = "Please select area type";
      }

      const areaNum = Number((propertyDetails.area || "").replace(/[^0-9]/g, ""));
      if (!propertyDetails.area || isNaN(areaNum) || areaNum <= 0) {
        errs.area = "Enter valid area in sq. ft.";
      }

      if (!propertyDetails.propertyAge || propertyDetails.propertyAge.trim() === "") {
        errs.propertyAge = "Please select property age";
      }

      if (!propertyDetails.approvingAuthority || propertyDetails.approvingAuthority.trim() === "") {
        errs.approvingAuthority = "Please select approving authority";
      }

      const valNum = Number((propertyDetails.estimatedMarketValue || "").replace(/[^0-9]/g, ""));
      if (!propertyDetails.estimatedMarketValue || isNaN(valNum) || valNum <= 0) {
        errs.estimatedMarketValue = "Enter valid estimated market value";
      }

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        Alert.alert(
          "Required Fields Missing",
          "Please fill in all required property details on Step 3 before proceeding."
        );
        return false;
      }
    }

    // 4th Page Validation (Step 4: Ownership Details)
    else if (currentStepIndex === 3) {
      if (!ownershipDetails.ownershipType || ownershipDetails.ownershipType.trim() === "") {
        errs.ownershipType = "Please select ownership type";
      }

      if (ownershipDetails.ownershipType === "Joint Ownership") {
        if (!ownershipDetails.coOwnerFullName || ownershipDetails.coOwnerFullName.trim() === "") {
          errs.coOwnerFullName = "Co-owner full name is required";
        }

        if (!ownershipDetails.coOwnerRelationship || ownershipDetails.coOwnerRelationship.trim() === "") {
          errs.coOwnerRelationship = "Please select relationship with co-owner";
        }

        const coPan = (ownershipDetails.coOwnerPan || "").trim().toUpperCase();
        if (!coPan || !PAN_REGEX.test(coPan)) {
          errs.coOwnerPan = "Enter a valid 10-character PAN for co-owner";
        }

        const coMobile = (ownershipDetails.coOwnerMobile || "").trim();
        if (!coMobile || !MOBILE_REGEX.test(coMobile)) {
          errs.coOwnerMobile = "Enter a valid 10-digit mobile number for co-owner";
        }
      }

      if (!ownershipDetails.isConfirmationChecked) {
        errs.isConfirmationChecked = "Please check the ownership confirmation declaration";
      }

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        Alert.alert(
          "Required Confirmation",
          "Please fill in all required ownership details and check the declaration on Step 4."
        );
        return false;
      }
    }

    // 5th Page Validation (Step 5: Documents)
    else if (currentStepIndex === 4) {
      const uploadedDocs = documents.filter((d) => Boolean(d.fileUri && d.fileUri.trim() !== ""));
      if (uploadedDocs.length === 0) {
        Alert.alert(
          "Document Upload Required",
          "Please upload at least one required document on Step 5 before proceeding to Review & Submit."
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
    setIsSubmitting(true);
    try {
      const draft: Partial<LoanApplicationDraft> = {
        loanType: "Property Loan",
        loanTypeId: "property-loan",
        customerProfile: customer || undefined,
        loanDetails,
        propertyDetails,
        businessDetails,
        bankingDetails,
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
          <>
            <PropertyLoanCustomerCard profile={customer || undefined} />
            <PropertyLoanFinancialsStep
              data={loanDetails}
              onChange={handleDetailsChange}
              errors={errors}
            />
          </>
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
            propertyDetails={propertyDetails}
            businessDetails={businessDetails}
            bankingDetails={bankingDetails}
            documents={documents}
            isConsentChecked={isConsentChecked}
            onConsentToggle={(checked) => setIsConsentChecked(checked)}
            onGoToStep={(stepIdx) => setCurrentStepIndex(stepIdx)}
          />
        );
    }
  };

  const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.circularBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#0F2052" />
        </TouchableOpacity>

        <View style={styles.headerCenterContent}>
          <Text style={styles.headerTitle}>Loan Against Property</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStepIndex + 1} of {STEPS.length} • {STEPS[currentStepIndex]}
          </Text>
        </View>

        <View style={styles.circularBtn} />
      </View>

      {/* Header Progress Line */}
      <View style={styles.progressBarTrack}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
        />
      </View>

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
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleNext}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color={BrandColors.WHITE} size="small" />
          ) : (
            <Text style={styles.continueBtnText}>
              {currentStepIndex === STEPS.length - 1
                ? "Submit Application"
                : "Continue"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PropertyLoanScreen;
