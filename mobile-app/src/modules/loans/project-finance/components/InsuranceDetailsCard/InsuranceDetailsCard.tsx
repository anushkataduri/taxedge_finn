import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { InsuranceDetailsForm } from "../../types/projectFinance.types";
import { INSURANCE_TYPES } from "../../data/step6Data";
import { ProjectFinanceDatePicker } from "../ProjectFinanceDatePicker/ProjectFinanceDatePicker";
import { OptionPickerModal } from "../OptionPickerModal";
import { styles } from "./InsuranceDetailsCard.styles";

interface InsuranceDetailsCardProps {
  data: InsuranceDetailsForm;
  onChange: (field: keyof InsuranceDetailsForm, value: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const InsuranceDetailsCard: React.FC<InsuranceDetailsCardProps> = ({
  data,
  onChange,
  isExpanded,
  onToggleExpand,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

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
            <Ionicons name="shield-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>4. Insurance Details</Text>
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
            Provide details of insurance coverage for the project (if applicable).
          </Text>

          {/* Type of Insurance */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Type of Insurance</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={
                  data.typeOfInsurance ? styles.pickerText : styles.placeholderText
                }
              >
                {data.typeOfInsurance || "Select insurance type"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Coverage Amount */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Coverage Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.coverageAmount}
              onChangeText={(text) => onChange("coverageAmount", text)}
            />
          </View>

          {/* Policy Validity */}
          <ProjectFinanceDatePicker
            label="Policy Validity"
            value={data.policyValidity}
            onChange={(dateStr) => onChange("policyValidity", dateStr)}
          />
        </View>
      )}

      {/* Reusable Option Picker Modal */}
      <OptionPickerModal
        visible={modalVisible}
        title="Select Insurance Type"
        options={INSURANCE_TYPES as unknown as string[]}
        onSelect={(item) => {
          onChange("typeOfInsurance", item);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default InsuranceDetailsCard;
