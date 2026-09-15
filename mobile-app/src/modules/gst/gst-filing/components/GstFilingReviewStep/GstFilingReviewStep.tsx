import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles } from "./GstFilingReviewStep.styles";

interface GstFilingReviewStepProps {
  gstin?: string;
  businessName?: string;
  taxpayerScheme?: string;
  filingNature?: string;
  financialYear?: string;
  filingMonth?: string;
  filingType?: string;
  filingFrequency?: string;
  uploadedDocsCount?: number;
  onApprove: () => void;
  onRequestChanges?: () => void;
}

export const GstFilingReviewStep: React.FC<GstFilingReviewStepProps> = ({
  gstin = "29ABCDE1234F1Z5",
  businessName = "Shree Deshmukh Traders",
  taxpayerScheme = "Regular Scheme",
  filingNature = "Regular Return",
  financialYear = "FY 2025-26",
  filingMonth = "July 2026",
  filingType = "GSTR-3B (Monthly Summary Return)",
  filingFrequency = "Monthly",
  uploadedDocsCount = 3,
  onApprove,
  onRequestChanges,
}) => {
  return (
    <View style={styles.container}>
      {/* Ready for Review Banner */}
      <View style={styles.readyCard}>
        <View style={styles.readyIconBox}>
          <Ionicons name="checkmark-sharp" size={16} color="#059669" />
        </View>
        <View style={styles.readyTextCol}>
          <Text style={styles.readyHeading}>Ready for Review</Text>
          <Text style={styles.readySub}>
            TaxEdge CA has prepared return computation based on your verified business records
          </Text>
        </View>
      </View>

      {/* 1. Filing Overview Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Filing Details</Text>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>GSTIN</Text>
          <Text style={styles.value}>{gstin || "Not Provided"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Business Entity</Text>
          <Text style={styles.value}>{businessName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Taxpayer Scheme</Text>
          <Text style={styles.value}>{taxpayerScheme}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Filing Type</Text>
          <Text style={styles.value}>{filingNature}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Financial Year</Text>
          <Text style={styles.value}>{financialYear}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Filing Period</Text>
          <Text style={styles.value}>{filingMonth}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Filing Frequency</Text>
          <Text style={styles.value}>{filingFrequency}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Return Form</Text>
          <Text style={styles.value}>{filingType.split(" ")[0]}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Attached Documents</Text>
          <Text style={styles.value}>{uploadedDocsCount} Files Verified</Text>
        </View>
      </View>

      {/* 2. Tax Computation Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tax Computation (Reconciled)</Text>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Gross Taxable Turnover</Text>
          <Text style={styles.value}>₹4,25,000</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Output GST (18%)</Text>
          <Text style={styles.value}>₹38,250</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Eligible Input Tax Credit (ITC)</Text>
          <Text style={[styles.value, { color: "#16A34A" }]}>- ₹22,500</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Net Tax Liability (Govt)</Text>
          <Text style={styles.value}>₹15,750</Text>
        </View>
      </View>

      {/* 3. TaxEdge Professional Fee Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Professional Filing Fee</Text>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>CA Consultancy & Reconciliation</Text>
          <Text style={styles.value}>₹1,986</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Platform GST (18%)</Text>
          <Text style={styles.value}>₹358</Text>
        </View>

        {/* Total Payable Row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalValue}>₹2,344</Text>
        </View>
      </View>

      {/* Secondary Request Changes Button */}
      <TouchableOpacity
        style={styles.requestChangesBtn}
        activeOpacity={0.8}
        onPress={
          onRequestChanges ||
          (() =>
            Alert.alert(
              "Request CA Review",
              "A TaxEdge Chartered Accountant will contact you within 15 minutes to adjust any numbers."
            ))
        }
      >
        <Ionicons name="create-outline" size={16} color={BrandColors.PRIMARY_ORANGE} />
        <Text style={styles.requestChangesText}>Request Changes / Recalculate</Text>
      </TouchableOpacity>
    </View>
  );
};

