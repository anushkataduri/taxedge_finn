import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { REVIEW_STEP_ITEMS } from "../../data/step7Data";
import { styles } from "./ReviewApplicationCard.styles";

export interface ReviewApplicationCardProps {
  onEditStep: (stepIndex: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  applicantName?: string;
  projectName?: string;
  projectSector?: string;
  totalCost?: string;
  loanRequired?: string;
  tenureYears?: string;
  uploadedDocsCount?: number;
}

export const ReviewApplicationCard: React.FC<ReviewApplicationCardProps> = ({
  onEditStep,
  isExpanded,
  onToggleExpand,
  applicantName,
  projectName,
  projectSector,
  totalCost,
  loanRequired,
  tenureYears,
  uploadedDocsCount = 0,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <Ionicons name="document-attach-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>2. Review Application</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#64748B"
        />
      </TouchableOpacity>

      {/* Body */}
      {isExpanded && (
        <View style={styles.cardBody}>
          <Text style={styles.subtitle}>
            Review your entered details before submitting. You can go back and edit
            any section if needed.
          </Text>

          {/* Executive Dossier Summary */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryHeaderRow}>
              <Text style={styles.summaryTitle}>Project Dossier Snapshot</Text>
              <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItemHalf}>
                <Text style={styles.summaryLabel}>Applicant / SPV</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {applicantName || "Not entered"}
                </Text>
              </View>

              <View style={styles.summaryItemHalf}>
                <Text style={styles.summaryLabel}>Project Sector</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {projectSector || "Not specified"}
                </Text>
              </View>

              <View style={styles.summaryItemFull}>
                <Text style={styles.summaryLabel}>Project Name</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {projectName || "Not entered"}
                </Text>
              </View>

              <View style={styles.summaryItemHalf}>
                <Text style={styles.summaryLabel}>Total Project Cost</Text>
                <Text style={styles.summaryValue}>
                  {totalCost ? `₹${totalCost}` : "Awaiting entry"}
                </Text>
              </View>

              <View style={styles.summaryItemHalf}>
                <Text style={styles.summaryLabel}>Loan Required</Text>
                <Text style={styles.summaryHighlightValue}>
                  {loanRequired ? `₹${loanRequired}` : "Awaiting entry"}
                </Text>
              </View>

              <View style={styles.summaryItemHalf}>
                <Text style={styles.summaryLabel}>Tenure</Text>
                <Text style={styles.summaryValue}>
                  {tenureYears ? `${tenureYears} Years` : "—"}
                </Text>
              </View>

              <View style={styles.summaryItemHalf}>
                <Text style={styles.summaryLabel}>Documents Uploaded</Text>
                <Text style={styles.summaryValue}>
                  {uploadedDocsCount} Files
                </Text>
              </View>
            </View>
          </View>

          {/* Steps checklist with Edit button */}
          {REVIEW_STEP_ITEMS.map((item) => (
            <View key={item.stepIndex} style={styles.reviewRow}>
              <View style={styles.rowLeft}>
                <Ionicons name={item.icon as any} size={18} color="#F97316" />
                <Text style={styles.stepTitle}>{item.title}</Text>
              </View>

              <View style={styles.rowRight}>
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                  <Text style={styles.completedText}>Ready</Text>
                </View>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => onEditStep(item.stepIndex)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editText}>Edit</Text>
                  <Ionicons name="chevron-forward" size={14} color="#EA580C" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ReviewApplicationCard;
