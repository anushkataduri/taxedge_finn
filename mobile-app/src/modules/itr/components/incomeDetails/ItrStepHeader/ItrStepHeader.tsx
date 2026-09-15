import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./ItrStepHeader.styles";

interface ItrStepHeaderProps {
  title?: string;
  categoryName?: string;
  onBack?: () => void;
}

export const ItrStepHeader: React.FC<ItrStepHeaderProps> = ({
  title = "ITR Filing",
  categoryName = "Business Income",
  onBack,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/service/itr-filing" as any);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleBack}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={20} color="#0B1F3A" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryPrefix}>Category: </Text>
          <Text style={styles.categoryHighlight}>{categoryName}</Text>
        </View>
      </View>

      {/* Right spacer to keep the center title balanced */}
      <View style={styles.rightSpacer} />
    </View>
  );
};
