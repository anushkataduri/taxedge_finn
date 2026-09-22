import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanApplicationStatus } from "../../../types/loans.types";
import { styles } from "./LoanStatusTracker.styles";

export interface TimelineItem {
  status: LoanApplicationStatus;
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  isCurrent: boolean;
}

export interface LoanStatusTrackerProps {
  currentStatus: LoanApplicationStatus;
  timeline: TimelineItem[];
}

export const LoanStatusTracker: React.FC<LoanStatusTrackerProps> = ({
  currentStatus,
  timeline,
}) => {
  return (
    <View style={styles.container}>
      {timeline.map((item, index) => {
        const isLast = index === timeline.length - 1;
        const isRejected = item.status === "Rejected" && item.isCurrent;
        const isOnHold = item.status === "On Hold" && item.isCurrent;

        return (
          <View key={item.status} style={styles.stageRow}>
            {/* Vertical timeline indicator */}
            <View style={styles.timelineCol}>
              <View
                style={[
                  styles.dot,
                  item.completed && styles.dotCompleted,
                  item.isCurrent && styles.dotCurrent,
                  isRejected && styles.dotRejected,
                  isOnHold && styles.dotHold,
                ]}
              >
                {item.completed ? (
                  <Ionicons
                    name="checkmark"
                    size={12}
                    color={BrandColors.COLOR_WHITE}
                  />
                ) : item.isCurrent ? (
                  <Ionicons
                    name="ellipse"
                    size={8}
                    color={BrandColors.COLOR_WHITE}
                  />
                ) : null}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.line,
                    item.completed && styles.lineCompleted,
                  ]}
                />
              )}
            </View>

            {/* Content Column */}
            <View style={styles.contentCol}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.stageTitle,
                    item.completed && styles.stageTitleCompleted,
                    item.isCurrent && styles.stageTitleCurrent,
                  ]}
                >
                  {item.title}
                </Text>
                {item.timestamp ? (
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                ) : null}
              </View>

              <Text style={styles.description}>{item.description}</Text>

              {item.isCurrent && item.status === "Query Raised" && (
                <View style={styles.actionBox}>
                  <Text style={styles.actionText}>
                    Action Required: Please provide the requested clarifications to resume review.
                  </Text>
                </View>
              )}

              {item.isCurrent && item.status === "Sanction Letter" && (
                <View style={styles.actionBox}>
                  <Text style={styles.actionText}>
                    Ready for Download: Official Sanction Letter available.
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default LoanStatusTracker;
