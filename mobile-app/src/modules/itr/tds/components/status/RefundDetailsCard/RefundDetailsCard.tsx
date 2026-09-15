import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TdsRefundStatusDetails } from "../../../types/status.types";
import { styles } from "./RefundDetailsCard.styles";

interface RefundDetailsCardProps {
  details: TdsRefundStatusDetails;
}

export const RefundDetailsCard: React.FC<RefundDetailsCardProps> = ({ details }) => {
  const rows = [
    {
      id: "appId",
      label: "Application ID",
      value: details.applicationId,
      iconName: "id-card-outline" as const,
      isOrange: false,
    },
    {
      id: "filedOn",
      label: "Filed On",
      value: details.filedOn,
      iconName: "calendar-outline" as const,
      isOrange: false,
    },
    {
      id: "refund",
      label: "Estimated Refund",
      value: details.estimatedRefund,
      iconName: "cash-outline" as const,
      isOrange: true,
    },
    {
      id: "refundTo",
      label: "Refund To",
      value: details.refundToBank,
      iconName: "business-outline" as const,
      isOrange: false,
    },
    {
      id: "time",
      label: "Expected Processing Time",
      value: details.expectedProcessingTime,
      iconName: "time-outline" as const,
      isOrange: false,
    },
  ];

  return (
    <View style={styles.card}>
      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;

        return (
          <View
            key={row.id}
            style={[styles.row, !isLast && styles.rowBorder]}
          >
            <View style={styles.leftGroup}>
              <View style={styles.iconBox}>
                <Ionicons
                  name={row.iconName}
                  size={18}
                  color={row.isOrange ? "#F97316" : "#0B1F3A"}
                />
              </View>
              <Text style={styles.label}>{row.label}</Text>
            </View>

            <Text
              style={[
                styles.value,
                row.isOrange ? styles.orangeValue : styles.normalValue,
              ]}
            >
              {row.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
