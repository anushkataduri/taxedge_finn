import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RevisedItrHeader } from "../../components/common";
import {
  ComputationComparisonTable,
  RevisedRefundHeroCard,
} from "../../components/review";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./ReviewRevisedComputationScreen.styles";

import { useAuthStore } from "@/modules/authentication/store/authStore";
import { useCustomerStore } from "@/modules/customer/store/customerStore";
import { useApplicationStore } from "@/store/applicationStore";
import { DEFAULT_REVISED_FORM_FIELDS } from "../../mock/revisedItrData";
import { RevisedFormFields } from "../../types/revisedItr.types";

const REVISION_REASON_MAP: Record<string, string> = {
  missed_income: "Missed Income",
  wrong_deduction: "Wrong Deduction",
  incorrect_bank: "Incorrect Bank Details",
  other: "Other Correction",
};

const getReasonLabel = (id?: string): string =>
  (id && REVISION_REASON_MAP[id]) || "Missed Income";

const maskPan = (pan?: string): string => {
  if (!pan || !pan.trim()) return "—";
  const clean = pan.trim().toUpperCase();
  if (clean.length === 10) {
    return `XXXXX${clean.slice(5)}`;
  }
  return clean;
};

const formatCustomerAddress = (cust?: any): string => {
  if (!cust) return "—";
  if (cust.address && cust.address.trim()) return cust.address.trim();
  const city = cust.city?.trim() || "";
  const state = cust.state?.trim() || "";
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  return "—";
};

const formatRupeeDisplay = (val?: string): string => {
  if (!val || !val.trim()) return "—";
  const cleaned = val.replace(/[^\d.-]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return val;
  return `₹${num.toLocaleString("en-IN")}`;
};

export const ReviewRevisedComputationScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    acknowledgementNumber?: string;
    assessmentYear?: string;
    revisionReason?: string;
    revisedDetails?: string;
    uploadedDocsCount?: string;
    totalDocsCount?: string;
  }>();

  const assessmentYear = params.assessmentYear || "AY 2025–26";
  const ackNo = params.acknowledgementNumber || "—";
  const uploadedDocs = params.uploadedDocsCount || "0";
  const totalDocs = params.totalDocsCount || "0";

  const customerFromAuth = useAuthStore((s) => s.customer);
  const profileFromCust = useCustomerStore((s) => s.profile);
  const customer = customerFromAuth || profileFromCust;

  let formDetails: RevisedFormFields = DEFAULT_REVISED_FORM_FIELDS;
  if (params.revisedDetails) {
    try {
      formDetails = JSON.parse(params.revisedDetails);
    } catch {}
  }

  const handleEditOriginal = () => {
    router.push({
      pathname: "/service/revised-itr" as any,
    });
  };

  const handleEditChanges = () => {
    router.push({
      pathname: "/service/revised-itr-update" as any,
      params: {
        acknowledgementNumber: ackNo,
        assessmentYear,
        revisionReason: params.revisionReason,
      },
    });
  };

  const handleEditDocs = () => {
    router.push({
      pathname: "/service/revised-itr-documents" as any,
      params: {
        acknowledgementNumber: ackNo,
        assessmentYear,
        revisionReason: params.revisionReason,
      },
    });
  };

  const createApplication = useApplicationStore((state) => state.createApplication);

  const handleProceedPayment = () => {
    const serviceTitle = `Revised ITR (${assessmentYear})`;
    const generatedAppId = createApplication(
      "revised-itr",
      serviceTitle,
      "ITR",
      {
        originalAckNo: ackNo,
        assessmentYear,
        revisionReason: getReasonLabel(params.revisionReason),
        revisedFields: formDetails,
      },
      [
        "PAN Card",
        "Aadhaar Card",
        `Form 16 / 16A (${assessmentYear})`,
        "AIS and TIS Statement",
        "Bank Statements",
        "Investment Proofs",
      ],
      999,
      "Pending"
    );

    router.push({
      pathname: "/service/itr-success" as any,
      params: {
        serviceType: "revised",
        serviceTitle,
        assessmentYear,
        applicationId: generatedAppId,
        uploadedDocsCount: uploadedDocs,
        totalDocsCount: totalDocs,
      },
    });
  };

  const renderInfoRow = (label: string, value: string) => (
    <View key={label} style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoVal}>{value}</Text>
    </View>
  );

  const originalReturnRows = [
    { label: "Ack Number", value: ackNo },
    { label: "Assessment Year", value: assessmentYear },
    { label: "ITR Form", value: "ITR-1" },
    {
      label: "Gross Total Income",
      value: formDetails.salaryBusinessIncome
        ? formatRupeeDisplay(formDetails.salaryBusinessIncome)
        : "—",
    },
  ];

  const personalInfoRows = [
    { label: "Full Name", value: customer?.name || "Customer" },
    { label: "PAN", value: maskPan(customer?.pan) },
    { label: "Date of Birth", value: customer?.dob || "—" },
    {
      label: "Mobile",
      value: (customer as any)?.mobile || (customer as any)?.mobileNumber || "—",
    },
    { label: "Email", value: customer?.email || "—" },
    { label: "Address", value: formatCustomerAddress(customer) },
  ];

  const isBankReason = params.revisionReason === "incorrect_bank";
  const changesRows = [
    { label: "Revision Reason", value: getReasonLabel(params.revisionReason) },
    ...(isBankReason
      ? [
          { label: "Revised Bank", value: formDetails.bankAccount || "—" },
          { label: "Revised IFSC", value: formDetails.ifsc || "—" },
        ]
      : [
          {
            label: "Revised Salary / Business",
            value: formatRupeeDisplay(formDetails.salaryBusinessIncome),
          },
          {
            label: "Revised Taxable Income",
            value: formatRupeeDisplay(formDetails.taxableIncome),
          },
        ]),
  ];

  const documentRows = [
    {
      label: "Uploaded Count",
      value: `${uploadedDocs} of ${totalDocs} documents`,
    },
    { label: "Verification Status", value: "Ready for CA Review" },
  ];

  return (
    <View style={[styles.container, getContainerInsetsStyle(insets.top)]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <RevisedItrHeader subtitle="Review Revised ITR" />

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          getScrollContentInsetsStyle(insets.bottom),
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Review Revised ITR</Text>
          <Text style={styles.pageSubtitle}>
            Review your updated details before proceeding to payment.
          </Text>
        </View>

        {/* 1. Original Return Section */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Original Return</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditOriginal}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoList}>
            {originalReturnRows.map((row) => renderInfoRow(row.label, row.value))}
          </View>
        </View>

        {/* 2. Personal Information Section */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditOriginal}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoList}>
            {personalInfoRows.map((row) => renderInfoRow(row.label, row.value))}
          </View>
        </View>

        {/* 3. Changes Section */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Changes</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditChanges}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoList}>
            {changesRows.map((row) => renderInfoRow(row.label, row.value))}
          </View>
        </View>

        {/* 4. Documents Section */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Documents</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditDocs}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoList}>
            {documentRows.map((row) => renderInfoRow(row.label, row.value))}
          </View>
        </View>

        {/* 5. Tax Calculation Comparison */}
        <ComputationComparisonTable />

        {/* 6. Revised Refund Summary Card */}
        <RevisedRefundHeroCard />
      </ScrollView>

      {/* Sticky Bottom Action Button */}
      <View
        style={[
          styles.bottomBar,
          getBottomBarInsetsStyle(insets.bottom),
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleProceedPayment}
          style={styles.proceedButton}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewRevisedComputationScreen;

