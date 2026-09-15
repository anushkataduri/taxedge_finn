import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./ComputationInfoBanner.styles";

export const ComputationInfoBanner: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="information" size={20} color="#FFFFFF" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Please review your tax computation</Text>
        <Text style={styles.description}>
          Your Tax Executive has completed the computation.{"\n"}
          Review every detail carefully before approving the return for filing.{"\n"}
          Nothing will be filed until you approve.
        </Text>
      </View>
    </View>
  );
};
