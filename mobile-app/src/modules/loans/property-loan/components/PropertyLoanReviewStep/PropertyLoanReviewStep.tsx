import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanDetailsFormData,
  LoanApplicantFormData,
  LoanPropertyFormData,
  LoanOwnershipFormData,
  LoanDocumentItem,
} from "../../../types/loans.types";
import { formatReviewAmountDigits, formatTenureEquivalent } from "../../../utils/loanFormatting";
import { maskPan as maskPanBase, maskMobile } from "../../../utils/maskingUtils";
import { styles } from "./PropertyLoanReviewStep.styles";

/** Property Loan review shows the first five PAN characters and the last one. */
const maskPan = (pan?: string): string => maskPanBase(pan, { visibleStart: 5, visibleEnd: 1 });
const formatCurrency = formatReviewAmountDigits;

export interface PropertyLoanReviewStepProps {
  loanDetails: LoanDetailsFormData;
  applicantDetails: LoanApplicantFormData;
  propertyDetails: LoanPropertyFormData;
  ownershipDetails: LoanOwnershipFormData;
  documents: LoanDocumentItem[];
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

export const PropertyLoanReviewStep: React.FC<PropertyLoanReviewStepProps> = ({
  loanDetails,
  applicantDetails,
  propertyDetails,
  ownershipDetails,
  documents,
  isConsentChecked,
  onConsentToggle,
  onGoToStep,
}) => {
  const uploadedDocs = documents.filter((d) => Boolean(d.fileUri));
  const hasExistingLoan = Boolean(
    ownershipDetails.currentLender ||
      (ownershipDetails.outstandingLoanAmount &&
        ownershipDetails.outstandingLoanAmount !== "0")
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mortgage Application Dossier Review</Text>
      <Text style={styles.sectionSubtitle}>
        Double-check your loan against property terms, title details, and financial papers.
      </Text>

      {/* 1. Loan Requirement Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Loan Requirement</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(0)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Requested Amount</Text>
          <Text style={styles.highlightValue}>
            {formatCurrency(loanDetails.requiredAmount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Loan Type</Text>
          <Text style={styles.value}>
            {loanDetails.customPurpose || loanDetails.purpose || "—"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Preferred Tenure</Text>
          <Text style={styles.value}>
            {loanDetails.preferredTenureMonths
              ? formatTenureEquivalent(loanDetails.preferredTenureMonths)
              : "—"}
          </Text>
        </View>
        {loanDetails.employmentType ? (
          <View style={styles.row}>
            <Text style={styles.label}>Employment Type</Text>
            <Text style={styles.value}>{loanDetails.employmentType}</Text>
          </View>
        ) : null}
      </View>

      {/* 2. Applicant & Income Profile Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Applicant & Income Profile</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(1)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Applicant Full Name</Text>
          <Text style={styles.value}>{applicantDetails.fullName || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>PAN</Text>
          <Text style={styles.value}>{maskPan(applicantDetails.pan)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{maskMobile(applicantDetails.mobile)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>{applicantDetails.dob || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Employment / Sector</Text>
          <Text style={styles.value}>
            {applicantDetails.employerName
              ? `${applicantDetails.employerName} (${applicantDetails.employerCategory || "Salaried"})`
              : applicantDetails.employerCategory || "—"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Declared Annual Income</Text>
          <Text style={styles.highlightValue}>
            {formatCurrency(applicantDetails.annualIncome)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Address</Text>
          <Text style={styles.value} numberOfLines={2}>
            {applicantDetails.currentAddress || "—"}
          </Text>
        </View>
      </View>

      {/* 3. Property & Asset Details Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Property & Asset Details</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(2)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Property Type</Text>
          <Text style={styles.value}>
            {propertyDetails.propertyType || "—"}
            {propertyDetails.propertySubType ? ` • ${propertyDetails.propertySubType}` : ""}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Construction & Usage</Text>
          <Text style={styles.value}>
            {propertyDetails.constructionStatus || "—"}
            {propertyDetails.currentUsage ? ` (${propertyDetails.currentUsage})` : ""}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Area</Text>
          <Text style={styles.value}>
            {propertyDetails.area ? `${propertyDetails.area} sq. ft.` : "—"}
            {propertyDetails.areaType ? ` (${propertyDetails.areaType})` : ""}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Property Age</Text>
          <Text style={styles.value}>{propertyDetails.propertyAge || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Approving Authority</Text>
          <Text style={styles.value}>{propertyDetails.approvingAuthority || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimated Market Valuation</Text>
          <Text style={styles.highlightValue}>
            {formatCurrency(propertyDetails.estimatedMarketValue)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location / Address</Text>
          <Text style={styles.value} numberOfLines={2}>
            {propertyDetails.propertyAddress || "—"}
            {propertyDetails.city ? `, ${propertyDetails.city}` : ""}
            {propertyDetails.state ? `, ${propertyDetails.state}` : ""}
            {propertyDetails.pincode ? ` - ${propertyDetails.pincode}` : ""}
          </Text>
        </View>
      </View>

      {/* 4. Ownership & Existing Loan Details Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Ownership & Security Details</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(3)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ownership Type</Text>
          <Text style={styles.value}>{ownershipDetails.ownershipType || "—"}</Text>
        </View>
        {ownershipDetails.ownershipType === "Joint Ownership" ? (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Co-owner Name</Text>
              <Text style={styles.value}>
                {ownershipDetails.coOwnerFullName || "—"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Relationship</Text>
              <Text style={styles.value}>
                {ownershipDetails.coOwnerRelationship || "—"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Co-owner PAN</Text>
              <Text style={styles.value}>
                {maskPan(ownershipDetails.coOwnerPan)}
              </Text>
            </View>
          </>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>Existing Property Loan</Text>
          <Text style={styles.value}>
            {hasExistingLoan
              ? `${ownershipDetails.currentLender || "Lender on File"} (${ownershipDetails.existingLoanType || "LAP"})`
              : "None / Unencumbered"}
          </Text>
        </View>
        {hasExistingLoan && ownershipDetails.outstandingLoanAmount ? (
          <View style={styles.row}>
            <Text style={styles.label}>Outstanding Balance</Text>
            <Text style={styles.value}>
              {formatCurrency(ownershipDetails.outstandingLoanAmount)}
            </Text>
          </View>
        ) : null}
      </View>

      {/* 5. Uploaded Records Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Uploaded Records</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(4)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.editText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.docsGrid}>
          {uploadedDocs.map((doc) => (
            <View key={doc.id} style={styles.docBadge}>
              <Ionicons name="document-text" size={12} color="#15803D" />
              <Text style={styles.docBadgeText}>{doc.name}</Text>
            </View>
          ))}
          {uploadedDocs.length === 0 && (
            <Text style={styles.emptyDocsText}>
              No documents uploaded yet.
            </Text>
          )}
        </View>
      </View>

      {/* Consent Declaration */}
      <TouchableOpacity
        style={styles.consentContainer}
        activeOpacity={0.8}
        onPress={() => onConsentToggle(!isConsentChecked)}
      >
        <View
          style={[styles.checkbox, isConsentChecked && styles.checkboxActive]}
        >
          {isConsentChecked && (
            <Ionicons
              name="checkmark"
              size={14}
              color={BrandColors.WHITE}
            />
          )}
        </View>
        <Text style={styles.consentText}>
          I authorize TaxEdge to conduct technical valuation, legal search title inquiry,
          and share financial dossiers with partnered banks & NBFCs for Property Loan underwriting.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PropertyLoanReviewStep;
