import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LoanDetailsFormData } from "../../../types/loans.types";
import { styles } from "./PersonalLoanFinancialsStep.styles";

export interface PersonalLoanFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: (field: keyof LoanDetailsFormData, value: any) => void;
  errors?: Record<string, string>;
}

const COMMON_PURPOSES = [
  "Personal Expenses",
  "Medical Emergency",
  "Home Renovation",
  "Debt Consolidation",
  "Travel & Vacation",
  "Wedding / Family Event",
  "Higher Education",
  "Other",
];

const TENURE_OPTIONS = [
  { label: "12 Mos (1 Yr)", value: "12" },
  { label: "24 Mos (2 Yrs)", value: "24" },
  { label: "36 Mos (3 Yrs)", value: "36" },
  { label: "48 Mos (4 Yrs)", value: "48" },
  { label: "60 Mos (5 Yrs)", value: "60" },
];

const AMOUNT_PRESETS = [
  { label: "₹1 Lakh", value: "100000" },
  { label: "₹3 Lakhs", value: "300000" },
  { label: "₹5 Lakhs", value: "500000" },
  { label: "₹10 Lakhs", value: "1000000" },
  { label: "₹20 Lakhs", value: "2000000" },
];

export const PersonalLoanFinancialsStep: React.FC<PersonalLoanFinancialsStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Loan Requirement & Capacity</Text>
      <Text style={styles.sectionSubtitle}>
        Specify how much personal capital you need and your current monthly repayment capacity.
      </Text>

      {/* Required Amount */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Required Loan Amount (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.requiredAmount && styles.inputError]}
          placeholder="e.g. 500000"
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

      {/* Purpose */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Purpose of Loan <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.purpose && styles.inputError]}
          placeholder="Specify personal reason"
          placeholderTextColor="#94A3B8"
          value={data.purpose}
          onChangeText={(text) => onChange("purpose", text)}
        />
        <View style={styles.chipRow}>
          {COMMON_PURPOSES.map((purpose) => {
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
          Preferred Tenure (Months) <Text style={styles.requiredStar}>*</Text>
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

      {/* Monthly Net Salary */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Monthly Net In-Hand Salary (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            errors.monthlyIncomeOrTurnover && styles.inputError,
          ]}
          placeholder="e.g. 75000"
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
        <Text style={styles.label}>Do you have any existing loans?</Text>
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
              No Existing Loans
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
              Yes, Active Loans
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Existing EMI */}
      {data.hasExistingLoans && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Total Current Monthly EMI (₹) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.existingEmi && styles.inputError]}
            placeholder="e.g. 15000"
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

export default PersonalLoanFinancialsStep;
