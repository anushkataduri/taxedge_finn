import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./RefundHeroCard.styles";

interface RefundHeroCardProps {
  isRefund?: boolean;
  amount: number;
}

export const RefundHeroCard: React.FC<RefundHeroCardProps> = ({
  isRefund = true,
  amount = 29585,
}) => {
  const formattedAmount = `₹${amount.toLocaleString("en-IN")}`;

  return (
    <View style={[styles.card, isRefund ? styles.refundCard : styles.payableCard]}>
      {/* Left Wallet/Icon Circle */}
      <View style={[styles.iconCircle, isRefund ? styles.refundIconCircle : styles.payableIconCircle]}>
        <Ionicons
          name={isRefund ? "wallet" : "receipt"}
          size={24}
          color={isRefund ? "#065F46" : "#7C2D12"}
        />
      </View>

      {/* Center Details */}
      <View style={styles.centerDetails}>
        <Text style={styles.heroSubtitle}>
          {isRefund ? "Estimated Refund" : "Tax Payable"}
        </Text>
        <Text style={styles.heroAmount}>{formattedAmount}</Text>
        <Text style={styles.heroExplanation}>
          Calculated after considering TDS, advance tax, deductions and eligible exemptions.
        </Text>
      </View>

      {/* Right Watermark Circle */}
      <View style={styles.watermarkCircle}>
        <Ionicons name="checkmark" size={24} color="#FFFFFF" />
      </View>
    </View>
  );
};
