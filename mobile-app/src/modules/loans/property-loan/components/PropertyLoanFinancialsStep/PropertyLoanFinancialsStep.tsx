import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LoanDetailsFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanFinancialsStep.styles";

export interface PropertyLoanFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: (field: keyof LoanDetailsFormData, value: any) => void;
  errors?: Record<string, string>;
}

const PURPOSES = [
  "Commercial Property Purchase",
  "Residential Property Mortgage (LAP)",
  "Commercial Mortgage Loan",
  "Industrial Factory / Land Mortgage",
  "Lease Rental Discounting (LRD)",
  "Business Expansion & Debt Consolidation",
];

const TENURES = [
  { label: "5 Years (60 Months)", value: "60" },
  { label: "7 Years (84 Months)", value: "84" },
  { label: "10 Years (120 Months)", value: "120" },
  { label: "15 Years (180 Months)", value: "180" },
  { label: "20 Years (240 Months)", value: "240" },
];

const APPLICANT_TYPES = [
  "Individual / Salaried",
  "Self-Employed Professional",
  "Business Owner / Proprietorship",
  "Partnership / LLP",
  "Private Limited Company",
];

export const PropertyLoanFinancialsStep: React.FC<PropertyLoanFinancialsStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [isPurposeOpen, setIsPurposeOpen] = useState(false);
  const [isTenureOpen, setIsTenureOpen] = useState(false);
  const [isApplicantOpen, setIsApplicantOpen] = useState(false);

  // EMI Calculation: P * R * (1+R)^N / ((1+R)^N - 1)
  const calculateEmi = (): string => {
    const rawAmount = (data.requiredAmount || "").replace(/[^0-9]/g, "");
    const principal = Number(rawAmount) || 5000000;
    const months = Number(data.preferredTenureMonths) || 180;
    const annualRate = 9.5;
    const monthlyRate = annualRate / 12 / 100;

    if (principal <= 0 || months <= 0) return "52,211";

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const rounded = Math.round(emi);
    return rounded.toLocaleString("en-IN");
  };

  const getTenureYears = (): string => {
    const m = Number(data.preferredTenureMonths) || 180;
    return `${Math.round(m / 12)} years`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Loan Requirement</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us how much you need and what it is for. You can review everything before you submit.
        </Text>

        {/* 1. Loan Purpose */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Loan Purpose <Text style={styles.requiredStar}>*</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsPurposeOpen(!isPurposeOpen)}
            style={[styles.dropdownBox, errors.purpose && styles.inputError]}
          >
            <Text style={data.purpose ? styles.dropdownText : styles.dropdownPlaceholder}>
              {data.purpose || "Select purpose"}
            </Text>
            <Ionicons
              name={isPurposeOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>

          {isPurposeOpen && (
            <View style={styles.dropdownMenu}>
              {PURPOSES.map((item) => {
                const isSelected = data.purpose === item;
                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.7}
                    onPress={() => {
                      onChange("purpose", item);
                      setIsPurposeOpen(false);
                    }}
                    style={[styles.dropdownMenuItem, isSelected && styles.dropdownMenuItemActive]}
                  >
                    <Text style={[styles.dropdownMenuText, isSelected && styles.dropdownMenuTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {errors.purpose && <Text style={styles.errorText}>{errors.purpose}</Text>}
        </View>

        {/* 2. Required Loan Amount */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Required Loan Amount <Text style={styles.requiredStar}>*</Text>
          </Text>

          <View style={[styles.amountRow, errors.requiredAmount && styles.inputError]}>
            <View style={styles.currencyPrefix}>
              <Text style={styles.currencyPrefixText}>₹</Text>
            </View>
            <TextInput
              style={styles.amountInput}
              placeholder="50,00,000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.requiredAmount}
              onChangeText={(text) => onChange("requiredAmount", text)}
            />
          </View>
          <Text style={styles.helperText}>
            Final amount depends on your property's value and eligibility.
          </Text>
          {errors.requiredAmount && <Text style={styles.errorText}>{errors.requiredAmount}</Text>}
        </View>

        {/* 3. Preferred Tenure */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Preferred Tenure <Text style={styles.requiredStar}>*</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsTenureOpen(!isTenureOpen)}
            style={[styles.dropdownBox, errors.preferredTenureMonths && styles.inputError]}
          >
            <Text style={data.preferredTenureMonths ? styles.dropdownText : styles.dropdownPlaceholder}>
              {TENURES.find((t) => t.value === data.preferredTenureMonths)?.label || "Select tenure"}
            </Text>
            <Ionicons
              name={isTenureOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>

          {isTenureOpen && (
            <View style={styles.dropdownMenu}>
              {TENURES.map((item) => {
                const isSelected = data.preferredTenureMonths === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    activeOpacity={0.7}
                    onPress={() => {
                      onChange("preferredTenureMonths", item.value);
                      setIsTenureOpen(false);
                    }}
                    style={[styles.dropdownMenuItem, isSelected && styles.dropdownMenuItemActive]}
                  >
                    <Text style={[styles.dropdownMenuText, isSelected && styles.dropdownMenuTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {errors.preferredTenureMonths && (
            <Text style={styles.errorText}>{errors.preferredTenureMonths}</Text>
          )}
        </View>

        {/* 4. Applicant Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Applicant Type <Text style={styles.requiredStar}>*</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsApplicantOpen(!isApplicantOpen)}
            style={[styles.dropdownBox, errors.employmentType && styles.inputError]}
          >
            <Text style={data.employmentType ? styles.dropdownText : styles.dropdownPlaceholder}>
              {data.employmentType || "Select applicant type"}
            </Text>
            <Ionicons
              name={isApplicantOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>

          {isApplicantOpen && (
            <View style={styles.dropdownMenu}>
              {APPLICANT_TYPES.map((type) => {
                const isSelected = data.employmentType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    activeOpacity={0.7}
                    onPress={() => {
                      onChange("employmentType", type);
                      setIsApplicantOpen(false);
                    }}
                    style={[styles.dropdownMenuItem, isSelected && styles.dropdownMenuItemActive]}
                  >
                    <Text style={[styles.dropdownMenuText, isSelected && styles.dropdownMenuTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          <Text style={styles.helperText}>
            The next steps and document list change based on this.
          </Text>
          {errors.employmentType && <Text style={styles.errorText}>{errors.employmentType}</Text>}
        </View>

        {/* 5. Existing customer with us? */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Existing customer with us? <Text style={styles.requiredStar}>*</Text>
          </Text>

          <View style={styles.segmentedToggle}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onChange("hasExistingLoans", true)}
              style={[
                styles.toggleOption,
                data.hasExistingLoans === true && styles.toggleOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleOptionText,
                  data.hasExistingLoans === true && styles.toggleOptionTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onChange("hasExistingLoans", false)}
              style={[
                styles.toggleOption,
                data.hasExistingLoans === false && styles.toggleOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleOptionText,
                  data.hasExistingLoans === false && styles.toggleOptionTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
          {errors.hasExistingLoans && <Text style={styles.errorText}>{errors.hasExistingLoans}</Text>}
        </View>

        {/* 6. Indicative EMI Card */}
        <View style={styles.emiCard}>
          <View style={styles.calcIconCircle}>
            <Ionicons name="calculator-outline" size={20} color="#0F4C81" />
          </View>

          <View style={styles.emiContent}>
            <Text style={styles.emiHeader}>Indicative EMI</Text>
            <View style={styles.emiAmountRow}>
              <Text style={styles.emiAmount}>₹{calculateEmi()}</Text>
              <Text style={styles.emiPeriod}>/ month</Text>
            </View>

            <Text style={styles.emiSubtitle}>
              Calculated at 9.5% p.a. for {getTenureYears()}. The final rate is decided after credit and property assessment.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PropertyLoanFinancialsStep;
