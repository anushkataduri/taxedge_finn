import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TaxComputationData } from "../../../types/computation.types";
import { styles } from "./TaxSummaryCard.styles";

interface TaxSummaryCardProps {
  computation: TaxComputationData;
}

export const TaxSummaryCard: React.FC<TaxSummaryCardProps> = ({ computation }) => {
  const rows = [
    {
      label: "Gross Total Income",
      value: `₹${computation.grossTotalIncome.toLocaleString("en-IN")}`,
    },
    {
      label: "Total Deductions",
      value: `-₹${computation.totalDeductions.toLocaleString("en-IN")}`,
    },
    {
      label: "Taxable Income",
      value: `₹${computation.taxableIncome.toLocaleString("en-IN")}`,
    },
    {
      label: "Income Tax + Cess",
      value: `₹${computation.taxPlusCess.toLocaleString("en-IN")}`,
    },
    {
      label: "Taxes Already Paid (TDS / Advance Tax)",
      value: `₹${computation.taxesPaid.toLocaleString("en-IN")}`,
    },
  ];

  const finalAmount = computation.isRefund
    ? computation.refundDue || 29585
    : computation.taxPayableDue || 0;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text-outline" size={18} color="#0B1F3A" />
        </View>
        <Text style={styles.cardTitle}>Tax Summary</Text>
      </View>

      {/* Breakdown Rows */}
      <View style={styles.rowsList}>
        {rows.map((r) => (
          <View key={r.label} style={styles.row}>
            <Text style={styles.rowLabel}>{r.label}</Text>
            <Text style={styles.rowValue}>{r.value}</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Final Result */}
      <View style={styles.finalRow}>
        <Text style={styles.finalLabel}>
          {computation.isRefund ? "Refund Due" : "Tax Payable"}
        </Text>
        <Text
          style={[
            styles.finalValue,
            computation.isRefund ? styles.refundValue : styles.payableValue,
          ]}
        >
          ₹{finalAmount.toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );
};
