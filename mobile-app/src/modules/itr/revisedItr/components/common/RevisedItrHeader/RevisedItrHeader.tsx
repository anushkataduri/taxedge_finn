import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./RevisedItrHeader.styles";

interface RevisedItrHeaderProps {
  subtitle: string;
  onBack?: () => void;
  hideBackButton?: boolean;
  onSaveDraft?: () => void;
}

export const RevisedItrHeader: React.FC<RevisedItrHeaderProps> = ({
  subtitle,
  onBack,
  hideBackButton = false,
  onSaveDraft,
}) => {
  const router = useRouter();

  const handleSaveDraftDefault = () => {
    import("react-native").then(({ Alert }) => {
      Alert.alert("Draft Saved", "Your revised ITR progress has been saved.", [
        { text: "OK", onPress: () => router.replace("/" as any) }
      ]);
    });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {!hideBackButton ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="#0B1F3A" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 38, height: 38 }} />
      )}

      <View style={styles.titleGroup}>
        <Text style={styles.title}>Revised ITR</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {true ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSaveDraft || handleSaveDraftDefault}
          style={styles.draftButton}
        >
          <Ionicons name="bookmark-outline" size={14} color="#EA580C" />
          <Text style={styles.draftButtonText}>Draft</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.rightSpacer} />
      )}
    </View>
  );
};
