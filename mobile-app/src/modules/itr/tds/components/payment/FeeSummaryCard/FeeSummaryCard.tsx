import React from "react";
import { View, Text } from "react-native";
import { TdsFeeBreakdown } from "../../../types/payment.types";
import { styles } from "./FeeSummaryCard.styles";

interface FeeSummaryCardProps {
  feeData: TdsFeeBreakdown;
}

export const FeeSummaryCard: React.FC<FeeSummaryCardProps> = ({ feeData }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Fee Summary</Text>

      <View style={styles.rowsList}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Refund estimate</Text>
          <Text style={styles.rowValue}>
            ₹{feeData.refundEstimate.toLocaleString("en-IN")}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Service fee ({feeData.serviceFeePercent}%)
          </Text>
          <Text style={styles.rowValue}>
            ₹{feeData.serviceFeeAmount.toLocaleString("en-IN")}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>GST @ {feeData.gstPercent}%</Text>
          <Text style={styles.rowValue}>
            ₹{feeData.gstAmount.toLocaleString("en-IN")}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total payable</Text>
        <Text style={styles.totalValue}>
          ₹{feeData.totalPayable.toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );
};
