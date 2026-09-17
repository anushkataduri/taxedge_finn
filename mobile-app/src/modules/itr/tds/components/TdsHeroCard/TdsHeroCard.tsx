import React from "react";
import { View, Text } from "react-native";
import { TdsHeroIllustration } from "../TdsHeroIllustration";
import { styles } from "./TdsHeroCard.styles";

export const TdsHeroCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.contentLeft}>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>Income Tax Services</Text>
        </View>

        <Text style={styles.title}>TDS Refund</Text>

        <Text style={styles.description}>
          Claim your excess TDS deducted by your employer, bank, or other deductors.
          Our tax experts will prepare and file your refund request to maximize
          the eligible refund.
        </Text>
      </View>

      <View style={styles.illustrationWrapper}>
        <TdsHeroIllustration />
      </View>
    </View>
  );
};
