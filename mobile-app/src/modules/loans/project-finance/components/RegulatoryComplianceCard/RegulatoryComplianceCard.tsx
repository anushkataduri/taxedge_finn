import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RegulatoryComplianceForm } from "../../types/projectFinance.types";
import { BUSINESS_REGISTRATION_TYPES } from "../../data/step6Data";
import { OptionPickerModal } from "../OptionPickerModal";
import { styles } from "./RegulatoryComplianceCard.styles";

interface RegulatoryComplianceCardProps {
  data: RegulatoryComplianceForm;
  onChange: (field: keyof RegulatoryComplianceForm, value: any) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const RegulatoryComplianceCard: React.FC<RegulatoryComplianceCardProps> = ({
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
            <Ionicons name="document-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>3. Regulatory Compliance</Text>
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
            Provide details of applicable registrations and compliances.
          </Text>

          {/* Business Registration Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Business Registration Type <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={
                  data.businessRegistrationType
                    ? styles.pickerText
                    : styles.placeholderText
                }
              >
                {data.businessRegistrationType || "Select registration type"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Registration Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Registration Number <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter registration number"
              placeholderTextColor="#94A3B8"
              value={data.registrationNumber}
              onChangeText={(text) => onChange("registrationNumber", text)}
            />
          </View>

          {/* GST Applicable? */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              GST Applicable? <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={styles.radioRow}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => onChange("gstApplicable", true)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    data.gstApplicable && styles.radioCircleSelected,
                  ]}
                >
                  {data.gstApplicable && <View style={styles.radioInnerDot} />}
                </View>
                <Text style={styles.radioText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => onChange("gstApplicable", false)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    !data.gstApplicable && styles.radioCircleSelected,
                  ]}
                >
                  {!data.gstApplicable && <View style={styles.radioInnerDot} />}
                </View>
                <Text style={styles.radioText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* GST Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              GST Number <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter GST number"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={data.gstNumber}
              onChangeText={(text) => onChange("gstNumber", text)}
            />
          </View>

          {/* Income Tax PAN */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Income Tax PAN <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter PAN number"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={data.panNumber}
              onChangeText={(text) => onChange("panNumber", text)}
            />
          </View>

          {/* TAN (if applicable) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>TAN (if applicable)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter TAN number"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={data.tanNumber}
              onChangeText={(text) => onChange("tanNumber", text)}
            />
          </View>
        </View>
      )}

      {/* Reusable Option Picker Modal */}
      <OptionPickerModal
        visible={modalVisible}
        title="Select Registration Type"
        options={BUSINESS_REGISTRATION_TYPES as unknown as string[]}
        onSelect={(item) => {
          onChange("businessRegistrationType", item);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default RegulatoryComplianceCard;
