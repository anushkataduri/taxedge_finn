import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanDocumentItem,
  CustomerProfileSummary,
} from "../../../types/loans.types";
import { styles } from "./MachineryLoanReviewStep.styles";

export interface MachineryLoanReviewStepProps {
  loanDetails: LoanDetailsFormData;
  businessDetails: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  profile?: Partial<CustomerProfileSummary>;
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

export const MachineryLoanReviewStep: React.FC<MachineryLoanReviewStepProps> = ({
  loanDetails,
  businessDetails,
  bankingDetails,
  documents,
  isConsentChecked,
  onConsentToggle,
  onGoToStep,
}) => {
  const formatCurrency = (val?: string | number) => {
    const num = Number(val);
    if (!val || isNaN(num)) return "₹0";
    return "₹" + num.toLocaleString("en-IN");
  };

  const maskAcc = (acc?: string) => {
    if (!acc || acc.length < 5) return acc || "—";
    return `XXXXXX${acc.slice(-4)}`;
  };

  const uploadedDocs = documents.filter((d) => Boolean(d.fileUri));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Machinery Loan Dossier Review</Text>
      <Text style={styles.sectionSubtitle}>
        Review your machinery financing request, business profile, and banking details.
      </Text>

      {/* 1. Loan Details Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="hardware-chip" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Loan Requirement</Text>
          </View>
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
          <Text style={styles.label}>Loan Amount</Text>
          <Text style={styles.highlightValue}>
            {formatCurrency(loanDetails.requiredAmount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Equipment Type</Text>
          <Text style={styles.value}>
            {loanDetails.customEquipmentType || loanDetails.purpose || "—"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tenure</Text>
          <Text style={styles.value}>
            {loanDetails.preferredTenureMonths ? `${loanDetails.preferredTenureMonths} Months` : "—"}
          </Text>
        </View>
      </View>

      {/* 2. Business Details Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="briefcase" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Business Profile</Text>
          </View>
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
          <Text style={styles.label}>Business Name</Text>
          <Text style={styles.value}>{businessDetails.businessName || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Business Type</Text>
          <Text style={styles.value}>
            {businessDetails.otherBusinessType || businessDetails.businessType || "—"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Business Vintage</Text>
          <Text style={styles.value}>{businessDetails.businessVintageYears || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Annual Turnover</Text>
          <Text style={styles.value}>{formatCurrency(businessDetails.annualTurnover)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>GST Status</Text>
          <Text style={styles.value}>
            {businessDetails.isGstRegistered
              ? `Registered (${businessDetails.gstin || "—"})`
              : "Not Registered"}
          </Text>
        </View>
      </View>

      {/* 3. Banking Details Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="card" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Banking</Text>
          </View>
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
          <Text style={styles.label}>Bank</Text>
          <Text style={styles.value}>
            {bankingDetails.primaryBankName || "—"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Masked Account Number</Text>
          <Text style={styles.value}>{maskAcc(bankingDetails.accountNumber)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>IFSC</Text>
          <Text style={styles.value}>{bankingDetails.ifscCode || "—"}</Text>
        </View>
      </View>

      {/* 4. Uploaded Documents Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="document-text" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Documents Uploaded</Text>
          </View>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(2)}
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
            <Text style={[styles.label, { fontStyle: "italic" }]}>
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
          I authorize TaxEdge to transmit machinery quotes and business financial records
          to machinery finance partner NBFCs and commercial banks.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MachineryLoanReviewStep;
