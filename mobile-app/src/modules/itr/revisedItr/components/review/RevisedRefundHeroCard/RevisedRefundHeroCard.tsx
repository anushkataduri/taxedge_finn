import React from "react";
import { View, Text } from "react-native";
import { styles } from "./RevisedRefundHeroCard.styles";

export const RevisedRefundHeroCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Text style={styles.rupeeIcon}>₹</Text>
      </View>

      <View style={styles.textGroup}>
        <Text style={styles.label}>Revised refund due</Text>
        <Text style={styles.amount}>₹12,458</Text>
        <Text style={styles.subtitle}>Down from ₹18,346 on the original return</Text>
      </View>
    </View>
  );
};
