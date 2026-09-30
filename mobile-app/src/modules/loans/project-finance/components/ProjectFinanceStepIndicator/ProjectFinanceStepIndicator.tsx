import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  styles,
  getProgressBarFillDynamic,
} from "./ProjectFinanceStepIndicator.styles";

export interface ProjectFinanceStepIndicatorProps {
  currentStepIndex: number;
  totalSteps?: number;
  stepTitle?: string;
  steps?: string[];
  onBack?: () => void;
  onSettings?: () => void;
  onStepPress?: (index: number) => void;
}

export const ProjectFinanceStepIndicator: React.FC<
  ProjectFinanceStepIndicatorProps
> = ({
  currentStepIndex,
  totalSteps = 7,
  stepTitle,
  steps,
  onBack,
  onSettings,
}) => {
  const finalTotalSteps = steps ? steps.length : totalSteps;
  const displayStepNumber = currentStepIndex + 1;
  const currentTitle =
    stepTitle || (steps && steps[currentStepIndex]) || `Step ${displayStepNumber}`;

  const progressPercent = Math.min(
    100,
    Math.max(0, (displayStepNumber / finalTotalSteps) * 100)
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.circleBtn}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={20} color="#0B1F3A" />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightSpacer} />
        )}

        <View style={styles.titleCenter}>
          <Text style={styles.mainTitle}>Project Finance</Text>
          <Text style={styles.subTitle}>
            Step {displayStepNumber} of {finalTotalSteps} • {currentTitle}
          </Text>
        </View>

        {onSettings ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSettings}
            style={styles.circleBtn}
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={18} color="#64748B" />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightSpacer} />
        )}
      </View>

      {/* Orange Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            getProgressBarFillDynamic(progressPercent),
          ]}
        />
      </View>
    </View>
  );
};

export default ProjectFinanceStepIndicator;
