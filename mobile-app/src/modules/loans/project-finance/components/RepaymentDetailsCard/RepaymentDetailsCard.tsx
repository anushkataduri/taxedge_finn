import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RepaymentDetailsForm } from "../../types/projectFinance.types";
import {
  REPAYMENT_YEARS,
  MORATORIUM_MONTHS,
  REPAYMENT_FREQUENCIES,
} from "../../data/projectFinanceData";
import { ProjectFinanceDatePicker } from "../ProjectFinanceDatePicker/ProjectFinanceDatePicker";
import { OptionPickerModal } from "../OptionPickerModal";
import { styles } from "./RepaymentDetailsCard.styles";

export interface RepaymentDetailsCardProps {
  data: RepaymentDetailsForm;
  onChange: (field: keyof RepaymentDetailsForm, value: any) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  calculatedEmi?: string;
}

export const RepaymentDetailsCard: React.FC<RepaymentDetailsCardProps> = ({
  data,
  onChange,
  isExpanded,
  onToggleExpand,
  calculatedEmi,
}) => {
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    field: keyof RepaymentDetailsForm | null;
  }>({
    visible: false,
    title: "",
    options: [],
    field: null,
  });

  const openPicker = (
    title: string,
    options: string[],
    field: keyof RepaymentDetailsForm
  ) => {
    setModalConfig({ visible: true, title, options, field });
  };

  const handleSelectOption = (value: string) => {
    if (modalConfig.field) {
      onChange(modalConfig.field, value);
    }
    setModalConfig({ visible: false, title: "", options: [], field: null });
  };

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
            <Ionicons name="calendar-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>2. Repayment Details</Text>
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
          {/* Repayment Period */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Repayment Period (Years) <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker("Select Repayment Period", REPAYMENT_YEARS, "repaymentPeriodYears")
              }
            >
              <Text
                style={
                  data.repaymentPeriodYears ? styles.pickerText : styles.placeholderText
                }
              >
                {data.repaymentPeriodYears || "Select years"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Moratorium Period */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Moratorium Period (Months)</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker("Select Moratorium Period", MORATORIUM_MONTHS, "moratoriumPeriodMonths")
              }
            >
              <Text
                style={
                  data.moratoriumPeriodMonths
                    ? styles.pickerText
                    : styles.placeholderText
                }
              >
                {data.moratoriumPeriodMonths || "Select months"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Repayment Frequency */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Repayment Frequency <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker(
                  "Select Frequency",
                  REPAYMENT_FREQUENCIES,
                  "repaymentFrequency"
                )
              }
            >
              <Text
                style={
                  data.repaymentFrequency
                    ? styles.pickerText
                    : styles.placeholderText
                }
              >
                {data.repaymentFrequency || "Select frequency"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Expected Interest Rate */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Expected Interest Rate (%) <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={styles.suffixInputContainer}>
              <TextInput
                style={styles.suffixInput}
                placeholder="Enter interest rate"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={data.expectedInterestRate}
                onChangeText={(text) => onChange("expectedInterestRate", text)}
              />
              <Text style={styles.suffixText}>%</Text>
            </View>
          </View>

          {/* Repayment Start Date */}
          <ProjectFinanceDatePicker
            label="Repayment Start Date"
            required
            value={data.repaymentStartDate}
            onChange={(dateStr) => onChange("repaymentStartDate", dateStr)}
          />

          {/* Preferred EMI */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Preferred EMI / Instalment (₹) (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder={calculatedEmi ? `e.g. ₹${calculatedEmi} (Calculated)` : "Enter amount"}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.preferredEmi}
              onChangeText={(text) => onChange("preferredEmi", text)}
            />
            <Text style={styles.helperText}>
              Optional. If left blank, the auto-calculated EMI will be applied.
            </Text>
          </View>
        </View>
      )}

      {/* Reusable Option Picker Modal */}
      <OptionPickerModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        options={modalConfig.options}
        onSelect={handleSelectOption}
        onClose={() =>
          setModalConfig({ visible: false, title: "", options: [], field: null })
        }
      />
    </View>
  );
};

export default RepaymentDetailsCard;
