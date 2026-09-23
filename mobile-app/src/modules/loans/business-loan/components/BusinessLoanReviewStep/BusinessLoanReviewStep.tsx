import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanDocumentItem,
  CustomerProfileSummary,
} from "../../../types/loans.types";
import { styles } from "./BusinessLoanReviewStep.styles";

export interface BusinessLoanReviewStepProps {
  loanDetails: LoanDetailsFormData;
  businessDetails: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  profile?: Partial<CustomerProfileSummary>;
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

const REVIEW_DOCUMENTS_LIST = [
  "PAN Card",
  "Aadhaar Card",
  "KYC of Directors / Partners",
  "Business Address Proof",
  "Current Account Bank Statements",
  "GST Certificate (REG-06)",
  "GST Returns (12 Months)",
  "Business ITR (Last 2-3 Years)",
  "Audited Balance Sheet",
  "Profit & Loss Statement",
  "Cash Flow Statement",
  "Udyam Registration Certificate",
  "Business Registration Proof",
  "Existing Loan Statement",
  "Existing Loan Sanction Letters",
  "Business Expansion Document",
];

export const BusinessLoanReviewStep: React.FC<BusinessLoanReviewStepProps> = ({
  loanDetails,
  businessDetails,
  bankingDetails,
  profile,
  isConsentChecked,
  onConsentToggle,
  onGoToStep,
}) => {
  const formatCurrency = (val?: string | number) => {
    const num = Number(val);
    if (!val || isNaN(num)) return "₹10,00,000";
    return "₹" + num.toLocaleString("en-IN");
  };

  const maskAcc = (acc?: string) => {
    if (!acc || acc.length < 4) return "XXXXXX9876";
    return `XXXXXX${acc.slice(-4)}`;
  };

  return (
    <View style={styles.container}>
      {/* Title Banner */}
      <Text style={styles.sectionTitle}>Application Dossier Review</Text>
      <Text style={styles.sectionSubtitle}>
        Please review all the details and uploaded documents before submitting to our lending partners.
      </Text>

      {/* 1. Applicant Information */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, { backgroundColor: "#E0F2FE" }]}>
              <Ionicons name="person" size={16} color="#2563EB" />
            </View>
            <Text style={styles.cardTitle}>Applicant Information</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#166534" />
            <Text style={styles.verifiedText}>Verified Profile</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile?.name || "Vani"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{profile?.mobile || "9121442578"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile?.email || "vani@gmail.com"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>PAN Number</Text>
          <Text style={styles.value}>{profile?.pan || "ANJPU4967E"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Aadhaar</Text>
          <Text style={styles.value}>XXXX-XXXX-6987</Text>
        </View>
      </View>

      {/* 2. Loan Requirement */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, { backgroundColor: "#FFF7ED" }]}>
              <Ionicons name="cash" size={16} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>Loan Requirement</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(0)} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={14} color="#2563EB" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Facility Type</Text>
          <Text style={styles.value}>{loanDetails.loanType || "Business Loan"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Requested Amount</Text>
          <Text style={styles.value}>{formatCurrency(loanDetails.requiredAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Purpose</Text>
          <Text style={styles.value}>{loanDetails.purpose || "Business Expansion"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Preferred Tenure</Text>
          <Text style={styles.value}>{loanDetails.preferredTenureMonths || "36"} Months</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Existing Loans</Text>
          <Text style={styles.value}>{loanDetails.hasExistingLoans ? "Yes" : "No"}</Text>
        </View>
        {loanDetails.hasExistingLoans && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Existing Lender Name</Text>
              <Text style={styles.value}>HDFC Bank</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Outstanding Amount</Text>
              <Text style={styles.value}>₹5,00,000</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Current EMI</Text>
              <Text style={styles.value}>₹12,000</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Remaining Tenure</Text>
              <Text style={styles.value}>24 Months</Text>
            </View>
          </>
        )}
      </View>

      {/* 3. Business Details */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, { backgroundColor: "#F3E8FF" }]}>
              <Ionicons name="git-network-outline" size={16} color="#7C3AED" />
            </View>
            <Text style={styles.cardTitle}>Business Details</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(1)} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={14} color="#2563EB" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Firm / Business Name</Text>
          <Text style={styles.value}>{businessDetails.businessName || "Levitica"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Business Constitution</Text>
          <Text style={styles.value}>{businessDetails.businessConstitution || "Private Limited Company"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Authorized Signatory</Text>
          <Text style={styles.value}>{businessDetails.signatoryName || "Ramesh Kumar"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>GSTIN</Text>
          <Text style={styles.value}>{businessDetails.gstin || "29AAAAA0000A1Z5"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Udyam Registration</Text>
          <Text style={styles.value}>
            {businessDetails.udyamRegistration ? `Yes (${businessDetails.udyamRegistration})` : "Yes (UDYAM123456)"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Business Vintage</Text>
          <Text style={styles.value}>{businessDetails.businessVintageYears || "3"} Years</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Annual Turnover</Text>
          <Text style={styles.value}>{formatCurrency(businessDetails.annualTurnover || "5000000")}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Net Profit</Text>
          <Text style={styles.value}>{formatCurrency(businessDetails.netProfit || "800000")}</Text>
        </View>
      </View>

      {/* 4. Banking & Tax Details */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="business" size={16} color="#DC2626" />
            </View>
            <Text style={styles.cardTitle}>Banking & Tax Details</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(2)} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={14} color="#2563EB" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Bank</Text>
          <Text style={styles.value}>{bankingDetails.primaryBankName || "HDFC Bank"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Account Number</Text>
          <Text style={styles.value}>{maskAcc(bankingDetails.accountNumber)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>IFSC Code</Text>
          <Text style={styles.value}>{bankingDetails.ifscCode || "HDFC0001234"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ITR Filing</Text>
          <Text style={styles.value}>Filed (Last 3 Years)</Text>
        </View>
      </View>

      {/* 5. Uploaded Documents */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="document-text" size={16} color="#166534" />
            </View>
            <Text style={styles.cardTitle}>Uploaded Documents</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.docCountText}>12 of 12 uploaded</Text>
            <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(3)} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={14} color="#2563EB" />
              <Text style={styles.editText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.docsGrid}>
          {REVIEW_DOCUMENTS_LIST.map((docName) => (
            <View key={docName} style={styles.docBadge}>
              <Ionicons name="document-text" size={12} color="#166534" />
              <Text style={styles.docBadgeText}>{docName}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 6. Consent Authorization Box */}
      <TouchableOpacity
        style={styles.consentContainer}
        activeOpacity={0.8}
        onPress={() => onConsentToggle(!isConsentChecked)}
      >
        <View style={[styles.checkbox, isConsentChecked && styles.checkboxActive]}>
          {isConsentChecked && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
        </View>
        <Text style={styles.consentText}>
          I hereby authorize TaxEdge and its lending partners to fetch my credit bureau report (CIBIL/Experian), verify submitted tax/bank statements, and represent my loan file before financial institutions.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BusinessLoanReviewStep;
