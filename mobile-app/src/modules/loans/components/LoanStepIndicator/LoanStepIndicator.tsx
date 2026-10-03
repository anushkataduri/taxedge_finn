import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, stepIndicatorColors, getProgressFillStyle } from "./LoanStepIndicator.styles";

/** Header with back button, "Step N of M" subtitle and an orange progress bar. */
export interface LinearLoanStepIndicatorProps {
  variant: "linear";
  title: string;
  /** Zero-based index of the active step. */
  currentStepIndex: number;
  totalSteps: number;
  /** Shown after "Step N of M •", typically the active step's name. */
  subtitle?: string;
  onBack: () => void;
  onSettings?: () => void;
}

/** Row of numbered circles; completed steps show a check mark. */
export interface NumberedLoanStepIndicatorProps {
  variant: "numbered";
  steps: readonly string[];
  /** Zero-based index of the active step. */
  currentStepIndex: number;
  /** When provided, completed and active steps become tappable. */
  onStepPress?: (index: number) => void;
}

export type LoanStepIndicatorProps = LinearLoanStepIndicatorProps | NumberedLoanStepIndicatorProps;

const LinearStepIndicator: React.FC<LinearLoanStepIndicatorProps> = ({
  title,
  currentStepIndex,
  totalSteps,
  subtitle,
  onBack,
  onSettings,
}) => {
  const displayStepNumber = currentStepIndex + 1;
  const progressPercent = totalSteps > 0 ? (displayStepNumber / totalSteps) * 100 : 0;
  const stepLabel = `Step ${displayStepNumber} of ${totalSteps}`;

  return (
    <View style={styles.linearContainer}>
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.circleBtn}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={20} color={stepIndicatorColors.backIcon} />
        </TouchableOpacity>

        <View style={styles.titleCenter}>
          <Text style={styles.mainTitle}>{title}</Text>
          <Text style={styles.subTitle}>{subtitle ? `${stepLabel} • ${subtitle}` : stepLabel}</Text>
        </View>

        {onSettings ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSettings}
            style={styles.circleBtn}
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={20} color={stepIndicatorColors.settingsIcon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightSpacer} />
        )}
      </View>

      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, getProgressFillStyle(progressPercent)]} />
      </View>
    </View>
  );
};

const NumberedStepIndicator: React.FC<NumberedLoanStepIndicatorProps> = ({
  steps,
  currentStepIndex,
  onStepPress,
}) => (
  <View style={styles.numberedContainer}>
    <View style={styles.stepsRow}>
      {steps.map((title, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;
        const isLast = index === steps.length - 1;

        return (
          <TouchableOpacity
            key={title}
            activeOpacity={0.7}
            disabled={!onStepPress || index > currentStepIndex}
            onPress={() => onStepPress?.(index)}
            style={styles.stepItem}
          >
            {!isLast && (
              <View style={[styles.stepLine, isCompleted && styles.stepLineCompleted]} />
            )}

            <View
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}
            >
              {isCompleted ? (
                <Ionicons name="checkmark" size={14} color={stepIndicatorColors.completedIcon} />
              ) : (
                <Text style={[styles.stepNumber, isActive && styles.stepNumberActive]}>{index + 1}</Text>
              )}
            </View>

            <Text numberOfLines={1} style={[styles.stepTitle, isActive && styles.stepTitleActive]}>
              {title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

export const LoanStepIndicator: React.FC<LoanStepIndicatorProps> = (props) =>
  props.variant === "linear" ? <LinearStepIndicator {...props} /> : <NumberedStepIndicator {...props} />;

export default LoanStepIndicator;
