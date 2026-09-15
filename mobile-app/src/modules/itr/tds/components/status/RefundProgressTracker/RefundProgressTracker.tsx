import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./RefundProgressTracker.styles";

export const RefundProgressTracker: React.FC = () => {
  const stages = [
    { id: "submitted", label: "Application\nSubmitted", state: "completed" as const },
    { id: "payment", label: "Payment\nCompleted", state: "completed" as const },
    { id: "verification", label: "Under\nVerification", state: "active" as const },
    { id: "filed", label: "Refund\nFiled", state: "pending" as const },
    { id: "processing", label: "Refund\nProcessing", state: "pending" as const },
    { id: "credited", label: "Refund\nCredited", state: "pending" as const },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.stagesRow}>
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;
          const isOrangeConnector = index < 2;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Node */}
              <View style={styles.stageNode}>
                {stage.state === "completed" && (
                  <View style={styles.completedCircle}>
                    <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                  </View>
                )}

                {stage.state === "active" && (
                  <View style={styles.activeCircle}>
                    <View style={styles.activeInnerDot} />
                  </View>
                )}

                {stage.state === "pending" && (
                  <View style={styles.pendingCircle} />
                )}

                <Text
                  style={[
                    styles.stageLabel,
                    stage.state === "active" && styles.activeLabel,
                    stage.state === "completed" && styles.completedLabel,
                    stage.state === "pending" && styles.pendingLabel,
                  ]}
                  numberOfLines={2}
                >
                  {stage.label}
                </Text>
              </View>

              {/* Connecting Line */}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    isOrangeConnector
                      ? styles.orangeConnector
                      : styles.greyConnector,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};
