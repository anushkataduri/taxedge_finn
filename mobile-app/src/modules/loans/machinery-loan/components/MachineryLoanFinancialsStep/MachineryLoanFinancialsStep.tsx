import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LoanDetailsFormData, LoanEmploymentType } from "../../../types/loans.types";
import { styles } from "./MachineryLoanFinancialsStep.styles";

export interface MachineryLoanFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: (field: keyof LoanDetailsFormData, value: any) => void;
  errors?: Record<string, string>;
}

const MACHINERY_CATEGORIES = [
  "CNC & Automation Tool",
  "Medical & Diagnostic Gear",
  "Printing & Packaging Unit",
  "Heavy Construction Crane",
  "Food Processing Plant",
  "Textile Weaving Machine",
];

const TENURE_OPTIONS = [
  { label: "24 M (2 Yrs)", value: "24" },
  { label: "36 M (3 Yrs)", value: "36" },
  { label: "48 M (4 Yrs)", value: "48" },
  { label: "60 M (5 Yrs)", value: "60" },
  { label: "84 M (7 Yrs)", value: "84" },
];

const AMOUNT_PRESETS = [
  { label: "₹15 Lakhs", value: "1500000" },
  { label: "₹30 Lakhs", value: "3000000" },
  { label: "₹50 Lakhs", value: "5000000" },
  { label: "₹1 Crore", value: "10000000" },
  { label: "₹2.5 Crores", value: "25000000" },
];

const EMPLOYMENT_TYPES: { label: string; value: LoanEmploymentType }[] = [
  { label: "Manufacturing Enterprise", value: "Business Owner" },
  { label: "Service Provider / Lab", value: "Self-Employed Professional" },
  { label: "Private Limited / LLP", value: "Salaried" },
];

export const MachineryLoanFinancialsStep: React.FC<MachineryLoanFinancialsStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Machinery & Equipment Capital</Text>
      <Text style={styles.sectionSubtitle}>
        Specify equipment financing required, machinery category, and repayment tenure.
      </Text>

      {/* Required Loan Amount */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Requested Financing Amount (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.requiredAmount && styles.inputError]}
          placeholder="e.g. 3000000"
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

      {/* Machinery Purpose */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Machinery / Equipment Type <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.purpose && styles.inputError]}
          placeholder="e.g. 5-Axis CNC Milling Machine"
          placeholderTextColor="#94A3B8"
          value={data.purpose}
          onChangeText={(text) => onChange("purpose", text)}
        />
        <View style={styles.chipRow}>
          {MACHINERY_CATEGORIES.map((category) => {
            const isSelected = data.purpose === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => onChange("purpose", category)}
                style={[styles.chip, isSelected && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextActive,
                  ]}
                >
                  {category}
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

      {/* Business Category */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Enterprise Profile <Text style={styles.requiredStar}>*</Text>
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

      {/* Monthly Net Turnover */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Monthly Production Turnover / Inflows (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            errors.monthlyIncomeOrTurnover && styles.inputError,
          ]}
          placeholder="e.g. 400000"
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
        <Text style={styles.label}>Any active machinery or business loans?</Text>
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
              Yes, Active EMIs
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

export default MachineryLoanFinancialsStep;
