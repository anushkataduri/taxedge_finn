import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ReturnDetailsData } from "../../../types/computation.types";
import { styles } from "./ReturnDetailsCard.styles";

interface ReturnDetailsCardProps {
  details: ReturnDetailsData;
}

export const ReturnDetailsCard: React.FC<ReturnDetailsCardProps> = ({ details }) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={18} color="#0B1F3A" />
        </View>
        <Text style={styles.cardTitle}>Return Details</Text>
      </View>

      {/* 2-Column Content */}
      <View style={styles.twoColumnContainer}>
        {/* Left Column */}
        <View style={styles.column}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Application ID</Text>
            <Text style={styles.appIdValue}>{details.applicationId}</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ITR Form</Text>
            <Text style={styles.fieldValue}>{details.itrForm}</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Assessment Year</Text>
            <Text style={styles.fieldValue}>{details.assessmentYear}</Text>
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Income Type</Text>
            <Text style={styles.fieldValue}>{details.incomeType}</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Status</Text>
            <Text style={styles.statusValue}>{details.status}</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Prepared By</Text>
            <Text style={styles.fieldValue}>{details.preparedBy}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
