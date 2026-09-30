import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RepaymentSourcesForm } from "../../types/projectFinance.types";
import {
  PRIMARY_SOURCES_REPAYMENT,
  SECONDARY_SOURCES_REPAYMENT,
} from "../../data/projectFinanceData";
import { OptionPickerModal } from "../OptionPickerModal";
import { styles } from "./RepaymentSourcesCard.styles";

export interface RepaymentSourcesCardProps {
  data: RepaymentSourcesForm;
  onChange: (field: keyof RepaymentSourcesForm, value: any) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  autoCalculatedDscr?: string;
}

export const RepaymentSourcesCard: React.FC<RepaymentSourcesCardProps> = ({
  data,
  onChange,
  isExpanded,
  onToggleExpand,
  autoCalculatedDscr,
}) => {
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    field: keyof RepaymentSourcesForm | null;
  }>({
    visible: false,
    title: "",
    options: [],
    field: null,
  });

  const openPicker = (
    title: string,
    options: string[],
    field: keyof RepaymentSourcesForm
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
            <Ionicons name="trending-up-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>4. Repayment Sources</Text>
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
            Specify the expected sources of repayment.
          </Text>

          {/* Primary Source */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Primary Source of Repayment <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker(
                  "Select Primary Source",
                  PRIMARY_SOURCES_REPAYMENT,
                  "primarySource"
                )
              }
            >
              <Text
                style={
                  data.primarySource ? styles.pickerText : styles.placeholderText
                }
              >
                {data.primarySource || "Select source"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Secondary Source */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Secondary Source (Optional)</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker(
                  "Select Secondary Source",
                  SECONDARY_SOURCES_REPAYMENT,
                  "secondarySource"
                )
              }
            >
              <Text
                style={
                  data.secondarySource ? styles.pickerText : styles.placeholderText
                }
              >
                {data.secondarySource || "Select source"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Projected DSCR */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              DSCR (Projected) <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={autoCalculatedDscr ? `e.g. ${autoCalculatedDscr} (Auto-calculated)` : "Enter DSCR"}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.projectedDscr || autoCalculatedDscr || ""}
              onChangeText={(text) => onChange("projectedDscr", text)}
            />
            <Text style={styles.helperText}>
              Auto-calculated based on projected financials. Editable.
            </Text>
          </View>

          {/* Explain Repayment Sources */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Explain Repayment Sources <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter details about expected cash flows and repayment sources"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={data.explanation}
              onChangeText={(text) => onChange("explanation", text)}
            />
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

export default RepaymentSourcesCard;
