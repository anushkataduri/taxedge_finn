import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PersonalInformationData, IncomeDetailsFormErrors } from "../../../types/incomeDetails.types";
import { AssessmentYearPickerModal } from "../AssessmentYearPickerModal";
import { styles } from "./PersonalInformationCard.styles";

interface PersonalInformationCardProps {
  data: PersonalInformationData;
  errors: IncomeDetailsFormErrors;
  onChange: (updated: Partial<PersonalInformationData>) => void;
}

export const PersonalInformationCard: React.FC<PersonalInformationCardProps> = ({
  data,
  errors,
  onChange,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showYearModal, setShowYearModal] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Personal Information</Text>

      {/* Row with PAN & Aadhaar */}
      <View style={styles.twoColumnRow}>
        {/* PAN Number Field */}
        <View style={styles.columnField}>
          <Text style={styles.fieldLabel}>
            PAN Number <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "pan" && styles.inputFocused,
              !!errors.panNumber && styles.inputError,
            ]}
          >
            <Ionicons name="card-outline" size={18} color="#0B1F3A" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter PAN Number"
              placeholderTextColor="#94A3B8"
              value={data.panNumber}
              autoCapitalize="characters"
              maxLength={10}
              onFocus={() => setFocusedField("pan")}
              onBlur={() => setFocusedField(null)}
              onChangeText={(text) => onChange({ panNumber: text.toUpperCase() })}
            />
          </View>
          {!!errors.panNumber && (
            <Text style={styles.errorText}>{errors.panNumber}</Text>
          )}
        </View>

        {/* Aadhaar Number Field */}
        <View style={styles.columnField}>
          <Text style={styles.fieldLabel}>
            Aadhaar Number <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "aadhaar" && styles.inputFocused,
              !!errors.aadhaarNumber && styles.inputError,
            ]}
          >
            <Ionicons name="person-outline" size={18} color="#0B1F3A" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter Aadhaar Number"
              placeholderTextColor="#94A3B8"
              value={data.aadhaarNumber}
              keyboardType="number-pad"
              maxLength={12}
              onFocus={() => setFocusedField("aadhaar")}
              onBlur={() => setFocusedField(null)}
              onChangeText={(text) => onChange({ aadhaarNumber: text.replace(/[^0-9]/g, "") })}
            />
          </View>
          {!!errors.aadhaarNumber && (
            <Text style={styles.errorText}>{errors.aadhaarNumber}</Text>
          )}
        </View>
      </View>

      {/* Assessment Year Field */}
      <View style={styles.fullWidthField}>
        <Text style={styles.fieldLabel}>
          Assessment Year <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowYearModal(true)}
          style={[
            styles.dropdownContainer,
            !!errors.assessmentYear && styles.inputError,
          ]}
        >
          <Text
            style={[
              styles.dropdownText,
              !data.assessmentYear && styles.dropdownPlaceholder,
            ]}
          >
            {data.assessmentYear
              ? `${data.assessmentYear}`
              : "Select Assessment Year"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#0B1F3A" />
        </TouchableOpacity>
        {!!errors.assessmentYear && (
          <Text style={styles.errorText}>{errors.assessmentYear}</Text>
        )}
      </View>

      <AssessmentYearPickerModal
        visible={showYearModal}
        selectedYear={data.assessmentYear}
        onSelect={(year) => onChange({ assessmentYear: year })}
        onClose={() => setShowYearModal(false)}
      />
    </View>
  );
};
