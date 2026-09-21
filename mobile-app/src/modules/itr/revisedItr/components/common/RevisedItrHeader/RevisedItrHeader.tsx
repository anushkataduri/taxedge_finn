import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./RevisedItrHeader.styles";

interface RevisedItrHeaderProps {
  subtitle: string;
  onBack?: () => void;
}

export const RevisedItrHeader: React.FC<RevisedItrHeaderProps> = ({
  subtitle,
  onBack,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
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

      <View style={styles.titleGroup}>
        <Text style={styles.title}>Revised ITR</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.rightSpacer} />
    </View>
  );
};
