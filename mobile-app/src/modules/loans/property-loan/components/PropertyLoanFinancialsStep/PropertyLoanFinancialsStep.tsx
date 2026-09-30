import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanDetailsFormData } from "../../../types/loans.types";
import { PropertyLoanDropdownModal } from "../PropertyLoanDropdownModal";
import { styles } from "./PropertyLoanFinancialsStep.styles";

export interface PropertyLoanFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: (field: keyof LoanDetailsFormData, value: string | number | boolean | null) => void;
  errors?: Record<string, string>;
}

const PURPOSES = [
  "Commercial Property Purchase",
  "Residential Property Mortgage (LAP)",
  "Commercial Mortgage Loan",
  "Industrial Factory / Land Mortgage",
  "Lease Rental Discounting (LRD)",
  "Business Expansion & Debt Consolidation",
  "Others",
];

export const TENURE_PRESETS = [
  { label: "12 Mos (1 Yr)", value: "12" },
  { label: "24 Mos (2 Yrs)", value: "24" },
  { label: "36 Mos (3 Yrs)", value: "36" },
  { label: "60 Mos (5 Yrs)", value: "60" },
  { label: "84 Mos (7 Yrs)", value: "84" },
  { label: "120 Mos (10 Yrs)", value: "120" },
  { label: "240 Mos (20 Yrs)", value: "240" },
];

export const formatTenureEquivalent = (monthsStr: string): string => {
  if (!monthsStr) return "";
  const months = parseInt(monthsStr, 10);
  if (isNaN(months) || months <= 0) return "";

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  if (remainingMonths === 0) {
    return `${months} months (${years} ${years === 1 ? "year" : "years"})`;
  }

  return `${months} months (${years} ${years === 1 ? "year" : "years"} ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"})`;
};

const isPresetTenure = (val?: string) =>
  Boolean(val && TENURE_PRESETS.some((item) => item.value === val));

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
  const [activeModal, setActiveModal] = useState<
    "purpose" | "applicantType" | null
  >(null);

  const [isCustomTenure, setIsCustomTenure] = useState<boolean>(() => {
    return Boolean(
      data.preferredTenureMonths && !isPresetTenure(data.preferredTenureMonths)
    );
  });
  const [customTenureValue, setCustomTenureValue] = useState<string>(() => {
    return !isPresetTenure(data.preferredTenureMonths)
      ? data.preferredTenureMonths || ""
      : "";
  });
  const [customError, setCustomError] = useState("");

  const handleSelectPreset = (val: string) => {
    setIsCustomTenure(false);
    setCustomError("");
    onChange("preferredTenureMonths", val);
  };

  const validateAndPropagateCustom = (clean: string) => {
    if (!clean) {
      setCustomError("");
      onChange("preferredTenureMonths", "");
      return;
    }
    const num = parseInt(clean, 10);
    if (num < 1) {
      setCustomError("Tenure must be at least 1 month");
      onChange("preferredTenureMonths", clean);
    } else if (num > 240) {
      setCustomError("Maximum permitted tenure is 240 months (20 years)");
      onChange("preferredTenureMonths", clean);
    } else {
      setCustomError("");
      onChange("preferredTenureMonths", clean);
    }
  };

  const handleSelectCustom = () => {
    setIsCustomTenure(true);
    if (customTenureValue) {
      validateAndPropagateCustom(customTenureValue);
    } else {
      onChange("preferredTenureMonths", "");
    }
  };

  const handleCustomTenureChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    setCustomTenureValue(clean);
    validateAndPropagateCustom(clean);
  };

  const isOthersPurposeSelected =
    data.purpose === "Others" ||
    (Boolean(data.purpose) &&
      !PURPOSES.filter((p) => p !== "Others").includes(data.purpose));

  const handleSelectPurpose = (val: string) => {
    setActiveModal(null);
    if (val === "Others") {
      onChange("purpose", "Others");
      onChange("customPurpose", "");
    } else {
      onChange("purpose", val);
      onChange("customPurpose", "");
    }
  };

  const handleCustomPurposeChange = (text: string) => {
    onChange("customPurpose", text);
    onChange("purpose", text || "Others");
  };

  // EMI Calculation: P * R * (1+R)^N / ((1+R)^N - 1)
  const calculateEmi = (): string => {
    const rawAmount = (data.requiredAmount || "").replace(/[^0-9]/g, "");
    const principal = Number(rawAmount) || 5000000;
    const months = Number(data.preferredTenureMonths) || 120;
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
    if (!data.preferredTenureMonths) return "10 years";
    return formatTenureEquivalent(data.preferredTenureMonths);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Loan Requirement</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us how much you need and what it is for. You can review everything before you submit.
        </Text>

        {/* 1. Loan Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Loan Type <Text style={styles.requiredStar}>*</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveModal("purpose")}
            style={[
              styles.dropdownSelector,
              Boolean(data.purpose) && styles.dropdownSelectorActive,
              Boolean(errors.purpose) && styles.inputError,
            ]}
          >
            <Text
              style={
                data.purpose ? styles.dropdownText : styles.dropdownPlaceholder
              }
            >
              {isOthersPurposeSelected
                ? "Others"
                : data.purpose || "Select Loan Type..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={data.purpose ? BrandColors.PRIMARY_ORANGE : "#64748B"}
            />
          </TouchableOpacity>
          {Boolean(errors.purpose && !isOthersPurposeSelected) && (
            <Text style={styles.errorText}>{errors.purpose}</Text>
          )}

          {/* Conditional input if Others is selected */}
          {isOthersPurposeSelected && (
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>
                Specify Loan Type <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.customInput,
                  Boolean(errors.customPurpose || errors.purpose) &&
                    styles.inputError,
                ]}
                placeholder="e.g., Construction Loan, Warehouse Mortgage"
                placeholderTextColor="#94A3B8"
                value={
                  data.customPurpose ||
                  (data.purpose !== "Others" ? data.purpose : "")
                }
                onChangeText={handleCustomPurposeChange}
              />
              {Boolean(
                errors.customPurpose ||
                  (errors.purpose && (!data.customPurpose || data.purpose === "Others"))
              ) && (
                <Text style={styles.errorText}>
                  {errors.customPurpose || errors.purpose}
                </Text>
              )}
            </View>
          )}
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
              placeholder="Enter your required amount"
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
            Preferred Tenure (Months) <Text style={styles.requiredStar}>*</Text>
          </Text>

          <View style={styles.tenureGrid}>
            {TENURE_PRESETS.map((item) => {
              const isSelected =
                !isCustomTenure && data.preferredTenureMonths === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.7}
                  onPress={() => handleSelectPreset(item.value)}
                  style={[
                    styles.tenureBox,
                    isSelected && styles.tenureBoxActive,
                  ]}
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

            {/* + Custom Option */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSelectCustom}
              style={[
                styles.tenureBox,
                styles.tenureBoxCustom,
                isCustomTenure && styles.tenureBoxCustomActive,
              ]}
            >
              <Text
                style={[
                  styles.tenureText,
                  styles.tenureTextCustom,
                  isCustomTenure && styles.tenureTextCustomActive,
                ]}
              >
                + Custom
              </Text>
            </TouchableOpacity>
          </View>

          {/* When the user selects Custom */}
          {isCustomTenure && (
            <View style={styles.customTenureSection}>
              <Text style={styles.customTenureTitle}>
                Enter Tenure (Months) <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.customTenureInput,
                  (Boolean(customError) ||
                    Boolean(errors.preferredTenureMonths)) &&
                    styles.inputError,
                ]}
                placeholder="Enter months (e.g., 48)"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={customTenureValue}
                onChangeText={handleCustomTenureChange}
                maxLength={3}
              />
              {Boolean(customTenureValue) && !customError && (
                <Text style={styles.tenureEquivalentText}>
                  {formatTenureEquivalent(customTenureValue)}
                </Text>
              )}
              {Boolean(customError) && (
                <Text style={styles.errorText}>{customError}</Text>
              )}
              {!customError && Boolean(errors.preferredTenureMonths) && (
                <Text style={styles.errorText}>
                  {errors.preferredTenureMonths}
                </Text>
              )}
            </View>
          )}

          {!isCustomTenure && Boolean(errors.preferredTenureMonths) && (
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
            onPress={() => setActiveModal("applicantType")}
            style={[
              styles.dropdownSelector,
              Boolean(data.employmentType) && styles.dropdownSelectorActive,
              errors.employmentType && styles.inputError,
            ]}
          >
            <Text
              style={
                data.employmentType
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.employmentType || "Select applicant type..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.employmentType ? BrandColors.PRIMARY_ORANGE : "#64748B"
              }
            />
          </TouchableOpacity>
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
            <Ionicons name="calculator-outline" size={18} color="#EA580C" />
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

      {/* Dropdown Modals */}
      <PropertyLoanDropdownModal
        visible={activeModal === "purpose"}
        title="Select Loan Type"
        options={PURPOSES}
        selectedValue={isOthersPurposeSelected ? "Others" : data.purpose}
        onSelect={handleSelectPurpose}
        onClose={() => setActiveModal(null)}
      />

      <PropertyLoanDropdownModal
        visible={activeModal === "applicantType"}
        title="Select Applicant Type"
        options={APPLICANT_TYPES}
        selectedValue={data.employmentType}
        onSelect={(val) => onChange("employmentType", val)}
        onClose={() => setActiveModal(null)}
      />
    </View>
  );
};

export default PropertyLoanFinancialsStep;
