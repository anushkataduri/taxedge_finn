import React from "react";
import { View, Text } from "react-native";
import { styles, getFillProgressStyle } from "./ItrProgressBar.styles";

interface ItrProgressBarProps {
  currentStep?: number;
  totalSteps?: number;
}

export const ItrProgressBar: React.FC<ItrProgressBarProps> = ({
  currentStep = 2,
  totalSteps = 5,
}) => {
  const percentage = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>
        Step {currentStep} of {totalSteps}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, getFillProgressStyle(percentage)]} />
      </View>
    </View>
  );
};
