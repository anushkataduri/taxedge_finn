import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LoanDetailsFormData, LoanEmploymentType } from "../../../types/loans.types";
import { styles } from "./PropertyLoanFinancialsStep.styles";

export interface PropertyLoanFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: (field: keyof LoanDetailsFormData, value: any) => void;
  errors?: Record<string, string>;
}

const LAP_PURPOSES = [
  "Residential LAP",
  "Commercial Mortgage",
  "Industrial Plot Mortgage",
  "Lease Rental Discounting",
  "Debt Consolidation",
  "Commercial Expansion",
];

const TENURE_OPTIONS = [
  { label: "3 Yrs (36 M)", value: "36" },
  { label: "5 Yrs (60 M)", value: "60" },
  { label: "7 Yrs (84 M)", value: "84" },
  { label: "10 Yrs (120 M)", value: "120" },
  { label: "15 Yrs (180 M)", value: "180" },
];

const AMOUNT_PRESETS = [
  { label: "₹25 Lakhs", value: "2500000" },
  { label: "₹50 Lakhs", value: "5000000" },
  { label: "₹1 Crore", value: "10000000" },
  { label: "₹2.5 Crores", value: "25000000" },
  { label: "₹5 Crores", value: "50000000" },
];

const EMPLOYMENT_TYPES: { label: string; value: LoanEmploymentType }[] = [
  { label: "Business Owner", value: "Business Owner" },
  { label: "Self-Employed Professional", value: "Self-Employed Professional" },
  { label: "Salaried", value: "Salaried" },
];

export const PropertyLoanFinancialsStep: React.FC<PropertyLoanFinancialsStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mortgage Facility & Valuation</Text>
      <Text style={styles.sectionSubtitle}>
        Specify required loan against property amount, collateral purpose, and tenure.
      </Text>

      {/* Requested Amount */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Required Loan Amount (₹) <Text style={styles.requiredStar}>*</Text>
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

      {/* Purpose of LAP */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Collateral Type & Purpose <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.purpose && styles.inputError]}
          placeholder="e.g. Working Capital against Commercial Shop"
          placeholderTextColor="#94A3B8"
          value={data.purpose}
          onChangeText={(text) => onChange("purpose", text)}
        />
        <View style={styles.chipRow}>
          {LAP_PURPOSES.map((purpose) => {
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
          Preferred Loan Tenure <Text style={styles.requiredStar}>*</Text>
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

      {/* Employment / Business Category */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Borrower Category <Text style={styles.requiredStar}>*</Text>
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

      {/* Monthly Net Income / Turnover */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Monthly Net Income / Inflows (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            errors.monthlyIncomeOrTurnover && styles.inputError,
          ]}
          placeholder="e.g. 200000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={data.monthlyIncomeOrTurnover}
          onChangeText={(text) => onChange("monthlyIncomeOrTurnover", text)}
        />
        {errors.monthlyIncomeOrTurnover && (
          <Text style={styles.errorText}>{errors.monthlyIncomeOrTurnover}</Text>
        )}
      </View>

      {/* Existing Loans */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Existing Active Loans / Encumbrances?</Text>
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
              No Encumbrance
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
            Total Ongoing Monthly EMI (₹) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.existingEmi && styles.inputError]}
            placeholder="e.g. 35000"
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

export default PropertyLoanFinancialsStep;
