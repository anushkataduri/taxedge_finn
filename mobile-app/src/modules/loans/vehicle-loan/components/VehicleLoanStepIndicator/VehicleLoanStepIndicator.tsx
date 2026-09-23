import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./VehicleLoanStepIndicator.styles";

export interface VehicleLoanStepIndicatorProps {
  currentStepIndex: number;
  totalSteps?: number;
  stepTitle: string;
  onBack: () => void;
  onSettings?: () => void;
}

export const VehicleLoanStepIndicator: React.FC<VehicleLoanStepIndicatorProps> = ({
  currentStepIndex,
  totalSteps = 5,
  stepTitle,
  onBack,
  onSettings,
}) => {
  const displayStepNumber = currentStepIndex + 1;
  const progressPercent = Math.min(
    100,
    Math.max(0, (displayStepNumber / totalSteps) * 100)
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.circleBtn}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={20} color="#0B1F3A" />
        </TouchableOpacity>

        <View style={styles.titleCenter}>
          <Text style={styles.mainTitle}>Vehicle Loan</Text>
          <Text style={styles.subTitle}>
            Step {displayStepNumber} of {totalSteps} • {stepTitle}
          </Text>
        </View>

        {onSettings ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSettings}
            style={styles.circleBtn}
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={20} color="#64748B" />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightSpacer} />
        )}
      </View>

      {/* Orange Linear Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
        />
      </View>
    </View>
  );
};

export default VehicleLoanStepIndicator;
