import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  ItrFilingFormData,
  MissingInfoItem,
} from "../../types/itrFiling.types";
import { MissingInfoBanner } from "../../../components/MissingInfoBanner";
import { styles } from "./Step5TaxSummaryReview.styles";

interface Step5TaxSummaryReviewProps {
  formData: ItrFilingFormData;
  isSubmitting: boolean;
  onEditStep: (stepIndex: number) => void;
  onToggleDeclaration: (accepted: boolean) => void;
  onSubmit: () => void;
}

export const Step5TaxSummaryReview: React.FC<Step5TaxSummaryReviewProps> = ({
  formData,
  isSubmitting,
  onEditStep,
  onToggleDeclaration,
  onSubmit,
}) => {
  const {
    personalInfo,
    bankDetails,
    incomeSources,
    determinedForm,
    regime,
    calculation,
    documents,
    gstReconciliation,
    declarationAccepted,
  } = formData;

  const [declarationReviewAccepted, setDeclarationReviewAccepted] = useState(true);

  // Filter uploaded or profile verified documents
  const verifiedOrUploadedDocs = documents.filter((d) => d.fileUri || d.isProfileVerified);

  // Derive Missing Information / Discrepancy list
  const missingItems: MissingInfoItem[] = [];

  if (!personalInfo.residentialStatusConfirmed) {
    missingItems.push({
      id: "miss-res",
      severity: "WARNING",
      title: "Residential status requires taxpayer confirmation",
      actionLabel: "Confirm",
      targetStep: 0,
    });
  }

  if (gstReconciliation && gstReconciliation.hasVariance) {
    missingItems.push({
      id: "miss-gst",
      severity: "WARNING",
      title: `GST turnover differs from books turnover by ₹${gstReconciliation.variance.toLocaleString("en-IN")}`,
      actionLabel: "Review",
      targetStep: 1,
    });
  }

  const missingRequiredDocs = documents.filter((d) => d.required && !d.fileUri && !d.isProfileVerified);
  if (missingRequiredDocs.length > 0) {
    missingItems.push({
      id: "miss-doc",
      severity: "REQUIRED",
      title: `${missingRequiredDocs.length} mandatory documents missing`,
      actionLabel: "Upload",
      targetStep: 3,
    });
  }

  const handleSubmitPress = () => {
    if (!declarationAccepted || !declarationReviewAccepted) {
      Alert.alert(
        "Declaration Required",
        "Please accept the confirmation checkboxes below to verify that your provided information and documents are true and complete."
      );
      return;
    }
    onSubmit();
  };

  const isRefund = calculation.finalType === "REFUND";
  const maskedBankNumber = bankDetails.accountNumber
    ? `•••• ${bankDetails.accountNumber.slice(-4)}`
    : "";

  // Pre-Calculation Reconciliation Data
  const baseReconciliationRows = [
    {
      id: "rec-personal",
      title: "Taxpayer Identity",
      sub: `PAN: ${personalInfo.pan} • Aadhaar: •••• ${personalInfo.aadhaar.slice(-4)}`,
      tagText: "Profile Verified",
      tagType: "verified" as const,
      visible: true,
    },
    {
      id: "rec-bank",
      title: "Refund Bank Account",
      sub: bankDetails.bankName
        ? `${bankDetails.bankName} (${maskedBankNumber})`
        : "Primary Refund Account Selected",
      tagText: "Pre-Validated",
      tagType: "verified" as const,
      visible: true,
    },
    {
      id: "rec-salary",
      title: "Salary Income",
      sub: `${incomeSources.salary.employerName || "Employer"} (TDS: ₹${Number(incomeSources.salary.tdsDeducted || 0).toLocaleString("en-IN")})`,
      amount: `₹ ${Number(incomeSources.salary.grossSalary || 0).toLocaleString("en-IN")}`,
      tagText: incomeSources.salary.source === "FORM_16" ? "Form 16 Matched" : "User Declared",
      tagType: incomeSources.salary.source === "FORM_16" ? ("verified" as const) : ("imported" as const),
      visible: incomeSources.salary.enabled && Number(incomeSources.salary.grossSalary || 0) > 0,
    },
    {
      id: "rec-business",
      title: "Business Turnover",
      sub: incomeSources.business.enabled
        ? `GSTIN: ${incomeSources.business.gstin || "29ABCDE1234F1Z5"}`
        : "No business declared",
      amount: incomeSources.business.enabled
        ? `₹ ${Number(incomeSources.business.grossTurnover || 0).toLocaleString("en-IN")}`
        : undefined,
      tagText: gstReconciliation?.hasVariance ? "Variance Noted" : "GST Reconciled",
      tagType: gstReconciliation?.hasVariance ? ("warning" as const) : ("verified" as const),
      visible: incomeSources.business.enabled,
    },
    {
      id: "rec-cg",
      title: "Capital Gains",
      sub: incomeSources.capitalGains.brokerName
        ? `Broker: ${incomeSources.capitalGains.brokerName} (${incomeSources.capitalGains.totalTransactions || 0} trades)`
        : "Capital gains declared",
      amount: `₹ ${(Number(incomeSources.capitalGains.shortTermGains || 0) + Number(incomeSources.capitalGains.longTermGains || 0)).toLocaleString("en-IN")}`,
      tagText: incomeSources.capitalGains.statementUploaded ? "Broker Parsed" : "User Declared",
      tagType: "imported" as const,
      visible:
        incomeSources.capitalGains.enabled &&
        (Number(incomeSources.capitalGains.shortTermGains || 0) > 0 ||
          Number(incomeSources.capitalGains.longTermGains || 0) > 0),
    },
    {
      id: "rec-other",
      title: "Other Sources (Interest & Dividends)",
      sub: "Savings interest, FD interest, dividends",
      amount: `₹ ${(Number(incomeSources.otherSources.savingsInterest || 0) + Number(incomeSources.otherSources.fdInterest || 0) + Number(incomeSources.otherSources.dividendIncome || 0)).toLocaleString("en-IN")}`,
      tagText: incomeSources.otherSources.source === "AIS_TIS" ? "AIS Imported" : "User Declared",
      tagType: "imported" as const,
      visible:
        incomeSources.otherSources.enabled &&
        Number(incomeSources.otherSources.savingsInterest || 0) +
          Number(incomeSources.otherSources.fdInterest || 0) +
          Number(incomeSources.otherSources.dividendIncome || 0) >
          0,
    },
    {
      id: "rec-tds",
      title: "Taxes Deducted (TDS Credits)",
      sub: "Matched with Form 26AS tax credit statement",
      amount: `₹ ${calculation.tdsCredits.toLocaleString("en-IN")}`,
      tagText: "26AS Matched",
      tagType: "verified" as const,
      visible: calculation.tdsCredits > 0,
    },
  ];

  const reconciliationRows = baseReconciliationRows.filter((r) => r.visible);

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.bannerCard}>
        <Ionicons name="shield-checkmark" size={24} color="#059669" />
        <View style={styles.bannerTextCol}>
          <Text style={styles.bannerTitle}>Review Your ITR Filing Return</Text>
          <Text style={styles.bannerSubtitle}>
            Please review the comprehensive return summary below before submitting to your Tax Executive.
          </Text>
        </View>
      </View>

      {/* Actionable Missing Information Banner */}
      {missingItems.length > 0 && (
        <MissingInfoBanner items={missingItems} onResolve={onEditStep} />
      )}

      {/* 1. Pre-Calculation Review & Reconciliation Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="git-network-outline" size={18} color="#083B75" />
            <Text style={styles.cardHeaderTitle}>Review & Reconciliation Audit</Text>
          </View>
        </View>

        <View style={styles.reconciliationTable}>
          {reconciliationRows.map((row) => (
            <View key={row.id} style={styles.reconciliationRow}>
              <View style={styles.reconciliationColLeft}>
                <Text style={styles.reconciliationTitle}>{row.title}</Text>
                <Text style={styles.reconciliationSub}>{row.sub}</Text>
              </View>

              <View style={styles.reconciliationColRight}>
                {row.amount && (
                  <Text style={styles.reconciliationAmount}>{row.amount}</Text>
                )}
                <View
                  style={
                    row.tagType === "verified"
                      ? styles.tagVerified
                      : row.tagType === "warning"
                      ? styles.tagWarning
                      : styles.tagImported
                  }
                >
                  <Ionicons
                    name={
                      row.tagType === "verified"
                        ? "checkmark-circle"
                        : row.tagType === "warning"
                        ? "alert-circle"
                        : "document-text"
                    }
                    size={11}
                    color={
                      row.tagType === "verified"
                        ? "#166534"
                        : row.tagType === "warning"
                        ? "#B45309"
                        : "#083B75"
                    }
                  />
                  <Text
                    style={
                      row.tagType === "verified"
                        ? styles.tagVerifiedText
                        : row.tagType === "warning"
                        ? styles.tagWarningText
                        : styles.tagImportedText
                    }
                  >
                    {row.tagText}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 2. Transparent Tax Calculation Card */}
      <View style={styles.taxHeroCard}>
        <View style={styles.taxHeroHeader}>
          <View style={styles.taxHeroHeaderLeft}>
            <Ionicons name="calculator-outline" size={20} color="#083B75" />
            <Text style={styles.taxHeroTitle}>Tax Calculation Summary</Text>
          </View>
          <View style={styles.regimeBadge}>
            <Text style={styles.regimeBadgeText}>
              {regime === "new" ? "New Tax Regime" : "Old Tax Regime"}
            </Text>
          </View>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>1. Gross Total Income</Text>
          <Text style={styles.calcValue}>
            ₹ {calculation.grossTotalIncome.toLocaleString("en-IN")}
          </Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>2. Less: Standard Deduction</Text>
          <Text style={styles.calcValueDeduction}>
            - ₹ {calculation.standardDeduction.toLocaleString("en-IN")}
          </Text>
        </View>

        {regime === "old" && calculation.totalChapterVIA > 0 && (
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>3. Less: Chapter VI-A Deductions</Text>
            <Text style={styles.calcValueDeduction}>
              - ₹ {calculation.totalChapterVIA.toLocaleString("en-IN")}
            </Text>
          </View>
        )}

        <View style={styles.calcDivider} />

        <View style={styles.calcRow}>
          <Text style={styles.calcValueTaxable}>Net Taxable Income</Text>
          <Text style={styles.calcValueTaxable}>
            ₹ {calculation.taxableIncome.toLocaleString("en-IN")}
          </Text>
        </View>

        <View style={styles.calcDivider} />

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Gross Income Tax (per Slabs)</Text>
          <Text style={styles.calcValue}>
            ₹ {calculation.grossTaxLiability.toLocaleString("en-IN")}
          </Text>
        </View>

        {calculation.rebate87A > 0 && (
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Less: Section 87A Rebate</Text>
            <Text style={styles.calcValueDeduction}>
              - ₹ {calculation.rebate87A.toLocaleString("en-IN")}
            </Text>
          </View>
        )}

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Health & Education Cess (4%)</Text>
          <Text style={styles.calcValue}>
            ₹ {calculation.cess.toLocaleString("en-IN")}
          </Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Total Tax Liability</Text>
          <Text style={styles.calcValue}>
            ₹ {calculation.totalTaxLiability.toLocaleString("en-IN")}
          </Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Less: Taxes Already Paid (TDS Credits)</Text>
          <Text style={styles.calcValueDeduction}>
            - ₹ {calculation.totalTaxesPaid.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Net Result Highlight */}
        <View
          style={[
            styles.netResultBox,
            isRefund ? styles.netResultBoxRefund : styles.netResultBoxPayable,
          ]}
        >
          <View>
            <Text style={styles.netResultLabel}>
              {isRefund ? "Net Estimated Refund" : "Net Tax Payable"}
            </Text>
            <Text style={styles.netResultSub}>
              {isRefund
                ? `Directly credited to ${bankDetails.bankName} (${maskedBankNumber})`
                : "Payable via ITNS 280 challan before filing"}
            </Text>
          </View>
          <Text
            style={
              isRefund ? styles.netResultAmountRefund : styles.netResultAmountPayable
            }
          >
            ₹ {calculation.finalAmount.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* CA Review Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Ionicons name="information-circle" size={16} color="#92400E" />
          <Text style={styles.disclaimerText}>
            Final tax liability is subject to CA review, verification of tax credits, and statutory portal validation.
          </Text>
        </View>
      </View>

      {/* 3. Filing Details Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="person-outline" size={18} color="#083B75" />
            <Text style={styles.cardHeaderTitle}>Filing & Taxpayer Details</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onEditStep(0)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Assessment Year</Text>
          <Text style={styles.detailValueBold}>AY {personalInfo.assessmentYear}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Applicable Return Form</Text>
          <Text style={styles.detailValueBold}>{determinedForm.form}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Full Name</Text>
          <Text style={styles.detailValue}>{personalInfo.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>PAN Number</Text>
          <Text style={styles.detailValue}>{personalInfo.pan}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Residential Status</Text>
          <Text style={styles.detailValue}>{personalInfo.residentialStatus || "Resident"}</Text>
        </View>
      </View>

      {/* 4. Uploaded & Verified Documents */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="attach-outline" size={18} color="#083B75" />
            <Text style={styles.cardHeaderTitle}>
              Verified & Uploaded Documents ({verifiedOrUploadedDocs.length})
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onEditStep(3)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.uploadedList}>
          {verifiedOrUploadedDocs.map((doc) => (
            <View key={doc.id} style={styles.uploadedItemRow}>
              <View style={styles.docCheckIcon}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
              </View>
              <View style={styles.docNameCol}>
                <Text style={styles.docItemName}>{doc.name}</Text>
                <Text style={styles.docItemFile}>
                  {doc.isProfileVerified
                    ? doc.profileVerifiedLabel || "Verified from Profile"
                    : `${doc.fileName || "Uploaded Document"} • ${doc.fileSize || "< 2 MB"}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 5. Confirmation Checkboxes */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.declarationBox}
        onPress={() => setDeclarationReviewAccepted(!declarationReviewAccepted)}
      >
        <Ionicons
          name={declarationReviewAccepted ? "checkbox" : "square-outline"}
          size={22}
          color={declarationReviewAccepted ? BrandColors.PRIMARY_ORANGE : "#64748B"}
        />
        <Text style={styles.declarationText}>
          I confirm that the information provided by me is true and complete to the best of my knowledge, and I have reviewed the income, deductions, bank details, and documents shown above.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.declarationBox}
        onPress={() => onToggleDeclaration(!declarationAccepted)}
      >
        <Ionicons
          name={declarationAccepted ? "checkbox" : "square-outline"}
          size={22}
          color={declarationAccepted ? BrandColors.PRIMARY_ORANGE : "#64748B"}
        />
        <Text style={styles.declarationText}>
          I confirm and submit my application for TaxEdge review.
        </Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isSubmitting}
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmitPress}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit for CA Review</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
