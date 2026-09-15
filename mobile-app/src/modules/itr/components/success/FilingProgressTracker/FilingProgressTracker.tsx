import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./FilingProgressTracker.styles";

export const FilingProgressTracker: React.FC = () => {
  const steps = [
    { id: "received", label: "Received", icon: "document-text" as const, active: true },
    { id: "verification", label: "Verification", icon: "search" as const, active: false },
    { id: "preparation", label: "Preparation", icon: "receipt" as const, active: false },
    { id: "approval", label: "Your Approval", icon: "person" as const, active: false },
    { id: "filed", label: "Filed", icon: "send" as const, active: false },
    { id: "everified", label: "E-verified", icon: "shield-checkmark" as const, active: false },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.stepsRow}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <View style={styles.stepNode}>
                <View
                  style={[
                    styles.iconCircle,
                    step.active ? styles.activeCircle : styles.inactiveCircle,
                  ]}
                >
                  <Ionicons
                    name={step.icon}
                    size={14}
                    color={step.active ? "#FFFFFF" : "#64748B"}
                  />
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step.active ? styles.activeLabel : styles.inactiveLabel,
                  ]}
                  numberOfLines={1}
                >
                  {step.label}
                </Text>
              </View>

              {/* Dashed connector line */}
              {!isLast && <View style={styles.connector} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};
