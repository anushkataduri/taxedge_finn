import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../hooks/use-theme";
import type { IconName, TimelineStep } from "../../types/domain";
import { styles } from "./StatusTimeline.styles";

export interface StatusTimelineProps {
  steps: TimelineStep[];
}

export function StatusTimeline({ steps }: StatusTimelineProps) {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = step.status === "completed";
        const isCurrent = step.status === "current";
        const isLast = index === steps.length - 1;

        const iconName: IconName = isCompleted
          ? "checkmark-circle"
          : isCurrent
            ? "play-circle"
            : "ellipse-outline";

        const iconColor = isCompleted
          ? colors.success
          : isCurrent
            ? colors.orange
            : colors.textSecondary;

        return (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.leftLineCol}>
              <Ionicons
                name={iconName}
                size={22}
                color={iconColor}
                style={styles.icon}
              />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: isCompleted
                        ? colors.success
                        : colors.border,
                    },
                  ]}
                />
              )}
            </View>
            <View style={styles.contentCol}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: isCurrent ? colors.orange : colors.text,
                      fontWeight: isCurrent || isCompleted ? "600" : "500",
                    },
                  ]}
                >
                  {step.title}
                </Text>
                {step.date && (
                  <Text
                    style={[styles.dateText, { color: colors.textSecondary }]}
                  >
                    {step.date}
                  </Text>
                )}
              </View>
              <Text style={[styles.desc, { color: colors.textSecondary }]}>
                {step.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
