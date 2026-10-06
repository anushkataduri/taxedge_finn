import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LoanDetailsFormData } from "../../../types/loans.types";
import { Dropdown } from "@/shared/components/Dropdown";
import { styles } from "./PersonalLoanFinancialsStep.styles";

export interface PersonalLoanFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: (field: keyof LoanDetailsFormData, value: any) => void;
  errors?: Record<string, string>;
  onInputFocus?: (field: string) => void;
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

const TENURE_DROPDOWN_OPTIONS = [
  { label: "3 Months", value: "3" },
  { label: "6 Months", value: "6" },
  { label: "12 Months", value: "12" },
  { label: "24 Months", value: "24" },
  { label: "36 Months", value: "36" },
  { label: "48 Months", value: "48" },
  { label: "60 Months", value: "60" },
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
  onInputFocus,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Financial Requirements</Text>
      <Text style={styles.sectionSubtitle}>
        Tell us how much you need and your current repayment capacity.
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
          onFocus={() => onInputFocus?.("requiredAmount")}
          onChangeText={(text) => onChange("requiredAmount", text.replace(/[^0-9]/g, ""))}
        />
        <View style={styles.chipRow}>
          {AMOUNT_PRESETS.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => onChange("requiredAmount", item.value)}
              style={styles.chip}
              activeOpacity={0.7}
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
          onFocus={() => onInputFocus?.("purpose")}
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
                activeOpacity={0.7}
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

      {/* Preferred Tenure Dropdown */}
      <View style={styles.fieldGroup}>
        <Dropdown
          label="Preferred Tenure (Months)"
          required
          placeholder="Select preferred tenure"
          options={TENURE_DROPDOWN_OPTIONS}
          value={data.preferredTenureMonths}
          onSelect={(val) => onChange("preferredTenureMonths", val)}
          error={errors.preferredTenureMonths}
        />
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
          onFocus={() => onInputFocus?.("monthlyIncomeOrTurnover")}
          onChangeText={(text) => onChange("monthlyIncomeOrTurnover", text.replace(/[^0-9]/g, ""))}
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
            activeOpacity={0.7}
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
            activeOpacity={0.7}
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

      {data.hasExistingLoans && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Current Total Monthly EMI (₹) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.existingEmi && styles.inputError]}
            placeholder="e.g. 15000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={data.existingEmi}
            onChangeText={(text) => onChange("existingEmi", text.replace(/[^0-9]/g, ""))}
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
