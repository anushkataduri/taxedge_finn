import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RepaymentScheduleRow } from "../../types/projectFinance.types";
import { styles } from "./RepaymentScheduleCard.styles";

interface RepaymentScheduleCardProps {
  schedule: RepaymentScheduleRow[];
  loanAmount?: string;
  interestRate?: string;
  tenureYears?: string;
  emi?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const RepaymentScheduleCard: React.FC<RepaymentScheduleCardProps> = ({
  schedule,
  loanAmount = "0",
  interestRate = "0",
  tenureYears = "0",
  emi = "0",
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <Ionicons name="bar-chart-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>3. Repayment Schedule (Indicative)</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#64748B"
        />
      </TouchableOpacity>

      {/* Body */}
      {isExpanded && (
        <View style={styles.cardBody}>
          <Text style={styles.subtitle}>
            Preview of estimated repayment schedule based on above details.
          </Text>

          {/* Key Metrics Grid */}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Loan Amount (₹)</Text>
              <Text style={styles.summaryVal}>{loanAmount || "0"}</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Interest Rate (%)</Text>
              <Text style={styles.summaryVal}>{interestRate || "0"}</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Tenure (Years)</Text>
              <Text style={styles.summaryVal}>{tenureYears || "0"}</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>EMI (₹)</Text>
              <Text style={styles.summaryVal}>{emi || "0"}</Text>
            </View>
          </View>

          {/* Horizontal Scroll Table */}
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableWrapper}>
              {/* Header Row */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.cellYear]}>Year</Text>
                <Text style={[styles.tableHeaderCell, styles.cellOpening]}>
                  Opening Balance (₹)
                </Text>
                <Text style={[styles.tableHeaderCell, styles.cellPrincipal]}>
                  Principal (₹)
                </Text>
                <Text style={[styles.tableHeaderCell, styles.cellInterest]}>
                  Interest (₹)
                </Text>
                <Text style={[styles.tableHeaderCell, styles.cellTotal]}>
                  Total Payment (₹)
                </Text>
                <Text style={[styles.tableHeaderCell, styles.cellClosing]}>
                  Closing Balance (₹)
                </Text>
              </View>

              {/* Data Rows */}
              {schedule.map((row) => (
                <View key={row.year} style={styles.tableDataRow}>
                  <Text
                    style={[
                      styles.tableDataCell,
                      styles.cellYear,
                      { fontWeight: "600", color: "#1E293B" },
                    ]}
                  >
                    {row.year}
                  </Text>
                  <Text style={[styles.tableDataCell, styles.cellOpening]}>
                    {row.openingBalance}
                  </Text>
                  <Text style={[styles.tableDataCell, styles.cellPrincipal]}>
                    {row.principal}
                  </Text>
                  <Text style={[styles.tableDataCell, styles.cellInterest]}>
                    {row.interest}
                  </Text>
                  <Text style={[styles.tableDataCell, styles.cellTotal]}>
                    {row.totalPayment}
                  </Text>
                  <Text style={[styles.tableDataCell, styles.cellClosing]}>
                    {row.closingBalance}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default RepaymentScheduleCard;
