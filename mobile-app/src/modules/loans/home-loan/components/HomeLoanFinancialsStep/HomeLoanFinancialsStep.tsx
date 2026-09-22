import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LoanDetailsFormData, LoanEmploymentType } from "../../../types/loans.types";
import { styles } from "./HomeLoanFinancialsStep.styles";

export interface HomeLoanFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: (field: keyof LoanDetailsFormData, value: any) => void;
  errors?: Record<string, string>;
}

const HOME_PURPOSES = [
  "New Apartment / Flat",
  "House Construction",
  "Resale Property",
  "Plot + Construction",
  "Home Renovation",
  "Balance Transfer",
];

const TENURE_OPTIONS = [
  { label: "10 Yrs (120 M)", value: "120" },
  { label: "15 Yrs (180 M)", value: "180" },
  { label: "20 Yrs (240 M)", value: "240" },
  { label: "25 Yrs (300 M)", value: "300" },
  { label: "30 Yrs (360 M)", value: "360" },
];

const AMOUNT_PRESETS = [
  { label: "₹25 Lakhs", value: "2500000" },
  { label: "₹50 Lakhs", value: "5000000" },
  { label: "₹75 Lakhs", value: "7500000" },
  { label: "₹1 Crore", value: "10000000" },
  { label: "₹2 Crores", value: "20000000" },
];

const EMPLOYMENT_TYPES: { label: string; value: LoanEmploymentType }[] = [
  { label: "Salaried", value: "Salaried" },
  { label: "Self-Employed Professional", value: "Self-Employed Professional" },
  { label: "Business Owner", value: "Business Owner" },
];

export const HomeLoanFinancialsStep: React.FC<HomeLoanFinancialsStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Housing Loan Requirement</Text>
      <Text style={styles.sectionSubtitle}>
        Specify your housing capital requirements, property purchase intent, and income status.
      </Text>

      {/* Required Amount */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Required Home Loan Amount (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.requiredAmount && styles.inputError]}
          placeholder="e.g. 5000000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={data.requiredAmount}
          onChangeText={(text) => onChange("requiredAmount", text)}
        />
        <View style={styles.chipRow}>
          {AMOUNT_PRESETS.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => onChange("requiredAmount", item.value)}
              style={styles.chip}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.requiredAmount && (
          <Text style={styles.errorText}>{errors.requiredAmount}</Text>
        )}
      </View>

      {/* Purpose of Loan */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Property Intent / Purpose <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.purpose && styles.inputError]}
          placeholder="e.g. Purchase of 3BHK flat"
          placeholderTextColor="#94A3B8"
          value={data.purpose}
          onChangeText={(text) => onChange("purpose", text)}
        />
        <View style={styles.chipRow}>
          {HOME_PURPOSES.map((purpose) => {
            const isSelected = data.purpose === purpose;
            return (
              <TouchableOpacity
                key={purpose}
                onPress={() => onChange("purpose", purpose)}
                style={[styles.chip, isSelected && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextActive,
                  ]}
                >
                  {purpose}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.purpose && (
          <Text style={styles.errorText}>{errors.purpose}</Text>
        )}
      </View>

      {/* Preferred Tenure */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Repayment Tenure <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View style={styles.tenureGrid}>
          {TENURE_OPTIONS.map((item) => {
            const isSelected = data.preferredTenureMonths === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                onPress={() => onChange("preferredTenureMonths", item.value)}
                style={[styles.tenureBox, isSelected && styles.tenureBoxActive]}
              >
                <Text
                  style={[
                    styles.tenureText,
                    isSelected && styles.tenureTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.preferredTenureMonths && (
          <Text style={styles.errorText}>{errors.preferredTenureMonths}</Text>
        )}
      </View>

      {/* Employment Type */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Employment / Income Category <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View style={styles.chipRow}>
          {EMPLOYMENT_TYPES.map((emp) => {
            const isSelected = data.employmentType === emp.value;
            return (
              <TouchableOpacity
                key={emp.value}
                onPress={() => onChange("employmentType", emp.value)}
                style={[styles.chip, isSelected && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextActive,
                  ]}
                >
                  {emp.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Monthly Net Income */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Monthly Net Household Income (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            errors.monthlyIncomeOrTurnover && styles.inputError,
          ]}
          placeholder="e.g. 150000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={data.monthlyIncomeOrTurnover}
          onChangeText={(text) => onChange("monthlyIncomeOrTurnover", text)}
        />
        {errors.monthlyIncomeOrTurnover && (
          <Text style={styles.errorText}>{errors.monthlyIncomeOrTurnover}</Text>
        )}
      </View>

      {/* Existing Loans Toggle */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Existing Active Loans / EMIs?</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => onChange("hasExistingLoans", false)}
            style={[
              styles.toggleButton,
              !data.hasExistingLoans && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                !data.hasExistingLoans && styles.toggleTextActive,
              ]}
            >
              No Other EMIs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChange("hasExistingLoans", true)}
            style={[
              styles.toggleButton,
              data.hasExistingLoans && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                data.hasExistingLoans && styles.toggleTextActive,
              ]}
            >
              Yes, Paying EMIs
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Existing EMI */}
      {data.hasExistingLoans && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Total Ongoing Monthly EMI (₹) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.existingEmi && styles.inputError]}
            placeholder="e.g. 20000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={data.existingEmi}
            onChangeText={(text) => onChange("existingEmi", text)}
          />
          {errors.existingEmi && (
            <Text style={styles.errorText}>{errors.existingEmi}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default HomeLoanFinancialsStep;
