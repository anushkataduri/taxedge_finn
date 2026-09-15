import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PreviousFilingOption } from "../../../types/deductions.types";
import { PreviousFilingOptionCard } from "../PreviousFilingOptionCard";
import { styles } from "./AdditionalInformationCard.styles";

interface AdditionalInformationCardProps {
  selectedOption: PreviousFilingOption;
  onSelect: (option: PreviousFilingOption) => void;
}

export const AdditionalInformationCard: React.FC<AdditionalInformationCardProps> = ({
  selectedOption,
  onSelect,
}) => {
  return (
    <View style={styles.card}>
      {/* Card Header with Orange Document Icon */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={20} color="#F97316" />
        </View>
        <View style={styles.headerTextGroup}>
          <Text style={styles.cardTitle}>Additional Information</Text>
          <Text style={styles.cardSubtitle}>
            Select the option that applies to your tax filing.
          </Text>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.questionText}>
        Do you have any previous ITR or Income Tax Notice?{" "}
        <Text style={styles.requiredStar}>*</Text>
      </Text>

      {/* 3 Option Cards */}
      <View style={styles.optionsList}>
        <PreviousFilingOptionCard
          id="previous_itr"
          title="Previous Year ITR Available"
          subtitle="We will use it to pre-verify your filing details."
          iconType="calendar"
          isSelected={selectedOption === "previous_itr"}
          onSelect={onSelect}
        />

        <PreviousFilingOptionCard
          id="tax_notice"
          title="Received Income Tax Notice"
          subtitle="Upload the notice later for expert review."
          iconType="notice"
          isSelected={selectedOption === "tax_notice"}
          onSelect={onSelect}
        />

        <PreviousFilingOptionCard
          id="none"
          title="No Previous ITR or Tax Notice"
          subtitle="Proceed with a fresh tax filing."
          iconType="fresh"
          isSelected={selectedOption === "none"}
          onSelect={onSelect}
        />
      </View>
    </View>
  );
};
