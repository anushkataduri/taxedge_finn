/**
 * Component: GstStepIndicator
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./GstStepIndicator.styles";

export interface GstStepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const GstStepIndicator: React.FC<GstStepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={step}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.circleActive,
                  isCompleted && styles.circleCompleted,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.numberText,
                      isActive && styles.numberTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.labelText,
                  (isActive || isCompleted) && styles.labelTextActive,
                ]}
              >
                {step}
              </Text>
            </View>

            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  isCompleted && styles.lineCompleted,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};
